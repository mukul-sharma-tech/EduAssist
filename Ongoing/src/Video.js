import React, { Component } from "react";
import io from "socket.io-client";
import faker from "faker";

import { IconButton, Badge, Input, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ChatIcon from "@mui/icons-material/Chat";
import PushPinIcon from "@mui/icons-material/PushPin";

import { message } from "antd";
// import "antd/dist/antd.css";

import { Row } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";
import "./Video.css";

const server_url =
  process.env.NODE_ENV === "production"
    ? "https://video.sebastienbiollo.com"
    : "http://localhost:4001";

var connections = {};
const peerConnectionConfig = {
  iceServers: [
    // { 'urls': 'stun:stun.services.mozilla.com' },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};
var socket = null;
var socketId = null;
var elms = 0;

class Video extends Component {
  constructor(props) {
    super(props);

    this.localVideoref = React.createRef();

    this.videoAvailable = false;
    this.audioAvailable = false;

    this.state = {
      video: false,
      audio: false,
      screen: false,
      showModal: false,
      screenAvailable: false,
      messages: [],
      message: "",
      newmessages: 0,
      askForUsername: true,
      username: faker.internet.userName(),
      usernames: {}, // socketId: username
      streams: {}, // socketId: MediaStream
      pinnedId: null, // for pinning a video
    };
    this.remoteVideoRefs = {}; // socketId: ref
    connections = {};

    this.getPermissions();
  }

  getPermissions = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => (this.videoAvailable = true))
        .catch(() => (this.videoAvailable = false));

      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => (this.audioAvailable = true))
        .catch(() => (this.audioAvailable = false));

      if (navigator.mediaDevices.getDisplayMedia) {
        this.setState({ screenAvailable: true });
      } else {
        this.setState({ screenAvailable: false });
      }

      if (this.videoAvailable || this.audioAvailable) {
        navigator.mediaDevices
          .getUserMedia({
            video: this.videoAvailable,
            audio: this.audioAvailable,
          })
          .then((stream) => {
            window.localStream = stream;
            this.localVideoref.current.srcObject = stream;
          })
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  getMedia = () => {
    this.setState(
      {
        video: this.videoAvailable,
        audio: this.audioAvailable,
      },
      () => {
        this.getUserMedia();
        this.connectToSocketServer();
      }
    );
  };

  getUserMedia = () => {
    if (
      (this.state.video && this.videoAvailable) ||
      (this.state.audio && this.audioAvailable)
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: this.state.video, audio: this.state.audio })
        .then(this.getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = this.localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              video: false,
              audio: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              for (let id in connections) {
                connections[id].addStream(window.localStream);

                connections[id].createOffer().then((description) => {
                  connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        id,
                        JSON.stringify({
                          sdp: connections[id].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                });
              }
            }
          );
        })
    );
  };

  getDislayMedia = () => {
    if (this.state.screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(this.getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              screen: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              this.getUserMedia();
            }
          );
        })
    );
  };

  gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  changeCssVideos = (main) => {
    // Remove dynamic resizing and enforce fixed aspect ratio
    let videos = main.querySelectorAll("video");
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.width = "100%";
      videos[a].style.height = "100%";
      videos[a].style.objectFit = "cover";
    }
    return {
      minWidth: "320px",
      minHeight: "180px",
      width: "100%",
      height: "100%",
    };
  };

  connectToSocketServer = () => {
    socket = io.connect(server_url, { secure: true });

    socket.on("signal", this.gotMessageFromServer);

    socket.on("connect", () => {
      socket.emit("join-call", window.location.href);
      socketId = socket.id;

      socket.on("chat-message", this.addMessage);

      socket.on("user-left", (id) => {
        // Remove user from state (usernames and streams)
        this.setState((prev) => {
          const usernames = { ...prev.usernames };
          const streams = { ...prev.streams };
          delete usernames[id];
          delete streams[id];
          return { usernames, streams };
        });
        // Remove ref
        delete this.remoteVideoRefs[id];
        elms = Object.keys(this.state.streams).length + 1; // +1 for local
        let main = document.getElementById("main");
        if (main) this.changeCssVideos(main);
      });

      // --- USERNAME SYNC LOGIC ---
      // When a user joins, request everyone's username
      socket.on("user-joined", (id, clients) => {
        // Send your username to everyone
        clients.forEach((clientId) => {
          if (clientId !== socketId) {
            socket.emit("username", this.state.username, socketId, clientId);
          }
        });
        // Request all usernames from everyone
        clients.forEach((clientId) => {
          if (clientId !== socketId) {
            socket.emit("request-username", clientId);
          }
        });
        // Send your username to the new user
        if (id !== socketId) {
          socket.emit("username", this.state.username);
        }
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConnectionConfig
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socket.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            this.setState(
              (prev) => ({
                streams: { ...prev.streams, [socketListId]: event.stream },
              }),
              () => {
                elms = Object.keys(this.state.streams).length + 1;
                let main = document.getElementById("main");
                if (main) this.changeCssVideos(main);
                // If username is missing, request it
                if (!this.state.usernames[socketListId]) {
                  socket.emit("request-username", socketListId);
                }
              }
            );
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([this.black(...args), this.silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketId) {
          for (let id2 in connections) {
            if (id2 === socketId) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socket.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });

      // Respond to username requests
      socket.on("request-username", (fromId) => {
        socket.emit("username", this.state.username, socketId, fromId);
      });

      // Receive username from others
      socket.on("username", (username, fromId, toId) => {
        if (!toId || toId === socketId) {
          this.setState((prev) => ({
            usernames: { ...prev.usernames, [fromId]: username },
          }));
        }
      });

      // Send your username to yourself (so you always have your own mapping)
      socket.emit("username", this.state.username, socketId, socketId);
    });
  };

  silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  handleVideo = () =>
    this.setState({ video: !this.state.video }, () => this.getUserMedia());
  handleAudio = () =>
    this.setState({ audio: !this.state.audio }, () => this.getUserMedia());
  handleScreen = () =>
    this.setState({ screen: !this.state.screen }, () => this.getDislayMedia());
  handlePin = (id) => {
    this.setState(
      (prev) => ({ pinnedId: prev.pinnedId === id ? null : id }),
      () => {
        // Always re-attach local stream to local video element
        if (this.localVideoref.current && window.localStream) {
          this.localVideoref.current.srcObject = window.localStream;
        }
        // Re-add local stream to all connections if available
        if (window.localStream) {
          for (let connId in connections) {
            try {
              const senders = connections[connId].getSenders();
              const tracks = window.localStream.getTracks();
              tracks.forEach((track) => {
                if (!senders.find((s) => s.track === track)) {
                  connections[connId].addTrack(track, window.localStream);
                }
              });
            } catch (e) {}
          }
        }
      }
    );
  };

  handleEndCall = () => {
    try {
      let tracks = this.localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };

  openChat = () => this.setState({ showModal: true, newmessages: 0 });
  closeChat = () => this.setState({ showModal: false });
  handleMessage = (e) => this.setState({ message: e.target.value });

  addMessage = (data, sender, socketIdSender) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, { sender: sender, data: data }],
    }));
    if (socketIdSender !== socketId) {
      this.setState({ newmessages: this.state.newmessages + 1 });
    }
  };

  handleUsername = (e) => this.setState({ username: e.target.value });

  sendMessage = () => {
    socket.emit("chat-message", this.state.message, this.state.username);
    this.setState({ message: "", sender: this.state.username });
  };

  copyUrl = () => {
    let text = window.location.href;
    if (!navigator.clipboard) {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        message.success("Link copied to clipboard!");
      } catch (err) {
        message.error("Failed to copy");
      }
      document.body.removeChild(textArea);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        message.success("Link copied to clipboard!");
      },
      () => {
        message.error("Failed to copy");
      }
    );
  };

  connect = () =>
    this.setState({ askForUsername: false }, () => this.getMedia());

  isSupportedBrowser = function () {
    let userAgent = (navigator && (navigator.userAgent || "")).toLowerCase();
    let vendor = (navigator && (navigator.vendor || "")).toLowerCase();
    let isChrome = /google inc/.test(vendor)
      ? userAgent.match(/(?:chrome|crios)\/(\d+)/)
      : null;
    let isFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
    return isChrome !== null || isFirefox !== null;
  };

  render() {
    if (!this.isSupportedBrowser()) {
      return (
        <div
          style={{
            background: "white",
            width: "30%",
            height: "auto",
            padding: "20px",
            minWidth: "400px",
            textAlign: "center",
            margin: "auto",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
          <h1>
            Sorry, this app works only with Google Chrome, Mozilla Firefox,
            Microsoft Edge, or Brave browsers.
          </h1>
        </div>
      );
    }
    const videoBoxStyle = {
      position: "relative",
      display: "inline-block",
      margin: "10px",
      width: "320px",
      height: "180px", // 16:9 aspect ratio
      background: "#111",
      borderStyle: "solid",
      borderColor: "#bdbdbd",
      borderRadius: "8px",
      overflow: "hidden",
      verticalAlign: "top",
      aspectRatio: "16/9",
    };
    const nameLabelStyle = {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "4px 0",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "16px",
      zIndex: 2,
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    };
    // If a video is pinned, show only that video (and local if pinned is local)
    const { pinnedId } = this.state;
    return (
      <div>
        {this.state.askForUsername === true ? (
          <div>
            <div
              style={{
                background: "white",
                width: "30%",
                height: "auto",
                padding: "20px",
                minWidth: "400px",
                textAlign: "center",
                margin: "auto",
                marginTop: "50px",
                justifyContent: "center",
              }}
            >
              <p
                style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}
              >
                Set your username
              </p>
              <Input
                placeholder="Username"
                value={this.state.username}
                onChange={(e) => this.handleUsername(e)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.connect}
                style={{ margin: "20px" }}
              >
                Connect
              </Button>
            </div>

            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
                paddingTop: "40px",
              }}
            >
              <video
                id="my-video"
                ref={this.localVideoref}
                autoPlay
                muted
                style={{
                  borderStyle: "solid",
                  borderColor: "#bdbdbd",
                  objectFit: "fill",
                  width: "60%",
                  height: "30%",
                }}
              ></video>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="btn-down"
              style={{
                backgroundColor: "whitesmoke",
                color: "whitesmoke",
                textAlign: "center",
              }}
            >
              <IconButton
                style={{ color: "#424242" }}
                onClick={this.handleVideo}
              >
                {this.state.video === true ? (
                  <VideocamIcon />
                ) : (
                  <VideocamOffIcon />
                )}
              </IconButton>

              <IconButton
                style={{ color: "#f44336" }}
                onClick={this.handleEndCall}
              >
                <CallEndIcon />
              </IconButton>

              <IconButton
                style={{ color: "#424242" }}
                onClick={this.handleAudio}
              >
                {this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              {this.state.screenAvailable === true ? (
                <IconButton
                  style={{ color: "#424242" }}
                  onClick={this.handleScreen}
                >
                  {this.state.screen === true ? (
                    <ScreenShareIcon />
                  ) : (
                    <StopScreenShareIcon />
                  )}
                </IconButton>
              ) : null}

              <Badge
                badgeContent={this.state.newmessages}
                max={999}
                color="secondary"
                onClick={this.openChat}
              >
                <IconButton
                  style={{ color: "#424242" }}
                  onClick={this.openChat}
                >
                  <ChatIcon />
                </IconButton>
              </Badge>
            </div>

            <Modal
              show={this.state.showModal}
              onHide={this.closeChat}
              style={{ zIndex: "999999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Chat Room</Modal.Title>
              </Modal.Header>
              <Modal.Body
                style={{
                  overflow: "auto",
                  overflowY: "auto",
                  height: "400px",
                  textAlign: "left",
                }}
              >
                {this.state.messages.length > 0 ? (
                  this.state.messages.map((item, index) => (
                    <div key={index} style={{ textAlign: "left" }}>
                      <p style={{ wordBreak: "break-all" }}>
                        <b>{item.sender}</b>: {item.data}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No message yet</p>
                )}
              </Modal.Body>
              <Modal.Footer className="div-send-msg">
                <Input
                  placeholder="Message"
                  value={this.state.message}
                  onChange={(e) => this.handleMessage(e)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.sendMessage}
                >
                  Send
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="container">
              <div style={{ paddingTop: "20px" }}>
                <Input value={window.location.href} disable="true"></Input>
                <Button
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "whitesmoke",
                    marginLeft: "20px",
                    marginTop: "10px",
                    width: "120px",
                    fontSize: "10px",
                  }}
                  onClick={this.copyUrl}
                >
                  Copy invite link
                </Button>
              </div>
              <Row
                id="main"
                className="flex-container"
                style={{
                  margin: 0,
                  padding: 0,
                  justifyContent: pinnedId ? "center" : undefined,
                }}
              >
                {/* Local video with username */}
                {(!pinnedId || pinnedId === "local") && (
                  <div
                    data-wrapper="local"
                    style={{
                      ...videoBoxStyle,
                      width:
                        pinnedId === "local" ? "640px" : videoBoxStyle.width,
                      height:
                        pinnedId === "local" ? "480px" : videoBoxStyle.height,
                    }}
                  >
                    <video
                      id="my-video"
                      ref={this.localVideoref}
                      autoPlay
                      muted
                      controls={false}
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        background: "#111",
                      }}
                    ></video>
                    <span style={nameLabelStyle}>
                      {this.state.username || "Me"}
                    </span>
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 3,
                        background: "#fff",
                        border: "1px solid #1976d2",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        padding: 4,
                      }}
                      onClick={() => this.handlePin("local")}
                      size="small"
                    >
                      <PushPinIcon
                        color={pinnedId === "local" ? "primary" : "action"}
                      />
                    </IconButton>
                  </div>
                )}
                {/* Remote videos with usernames */}
                {Object.entries(this.state.streams).map(([id, stream]) => {
                  if (!this.remoteVideoRefs[id])
                    this.remoteVideoRefs[id] = React.createRef();
                  const username = this.state.usernames[id] || "User";
                  if (pinnedId && pinnedId !== id) return null;
                  return (
                    <div
                      key={id}
                      data-wrapper={id}
                      style={{
                        ...videoBoxStyle,
                        width: pinnedId === id ? "640px" : videoBoxStyle.width,
                        height:
                          pinnedId === id ? "360px" : videoBoxStyle.height,
                      }}
                    >
                      {/* Video or placeholder */}
                      {stream &&
                      stream.getVideoTracks().length > 0 &&
                      stream.getVideoTracks()[0].enabled ? (
                        <video
                          data-socket={id}
                          ref={(el) => {
                            this.remoteVideoRefs[id].current = el;
                            if (el && el.srcObject !== stream) {
                              el.srcObject = stream;
                            }
                          }}
                          autoPlay
                          playsInline
                          controls={false}
                          disablePictureInPicture
                          controlsList="nodownload nofullscreen noremoteplayback"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            background: "#111",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        ></video>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#222",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#888",
                            fontSize: "24px",
                            flexDirection: "column",
                            borderRadius: "8px",
                          }}
                        >
                          <span style={{ fontSize: 48, marginBottom: 8 }}>
                            📷
                          </span>
                          <span
                            style={{ fontWeight: "bold", letterSpacing: 2 }}
                          >
                            NO VIDEO
                          </span>
                        </div>
                      )}
                      <span style={nameLabelStyle}>{username}</span>
                      <IconButton
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 3,
                          background: "#fff",
                          border: "1px solid #1976d2",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          padding: 4,
                        }}
                        onClick={() => this.handlePin(id)}
                        size="small"
                      >
                        <PushPinIcon
                          color={pinnedId === id ? "primary" : "action"}
                        />
                      </IconButton>
                    </div>
                  );
                })}
              </Row>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Video;

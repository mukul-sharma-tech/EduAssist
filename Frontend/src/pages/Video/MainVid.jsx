import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";

const SIGNAL_SERVER_URL = "http://localhost:5001"; // Change if deployed

const MainVid = () => {
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]); // [{id, stream}]
  const [peers, setPeers] = useState({}); // {id: RTCPeerConnection}
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const pendingCandidates = useRef({}); // { peerId: [candidates] }

  // ICE servers config with TURN and pool size
  const iceServers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
      {
        urls: "turn:relay.metered.ca:80",
        username: "openai",
        credential: "openai",
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // Get user media when joined or when cam/mic is toggled on
  useEffect(() => {
    if (joined && (camOn || micOn)) {
      navigator.mediaDevices
        .getUserMedia({ video: camOn, audio: micOn })
        .then((stream) => {
          // Remove old tracks from all peers
          Object.values(peers).forEach((peer) => {
            peer.getSenders().forEach((sender) => {
              if (sender.track) {
                sender.track.stop();
                peer.removeTrack(sender);
              }
            });
          });
          // Add new tracks to all peers
          Object.values(peers).forEach((peer) => {
            stream.getTracks().forEach((track) => {
              peer.addTrack(track, stream);
            });
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = camOn ? stream : null;
          }
        })
        .catch((err) => {
          alert("Could not access camera/mic: " + err.message);
        });
    }
    // Cleanup on leave or when both cam and mic are off
    return () => {
      const videoElem = localVideoRef.current;
      if (!camOn && !micOn && localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        if (videoElem) videoElem.srcObject = null;
      }
      if (!joined && localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        if (videoElem) videoElem.srcObject = null;
      }
    };
    // eslint-disable-next-line
  }, [joined, camOn, micOn]);

  // Connect socket after joining and when local stream is ready
  useEffect(() => {
    if (
      joined &&
      (camOn || micOn) &&
      localStreamRef.current &&
      !socketRef.current
    ) {
      connectSocket(localStreamRef.current);
    }
    // eslint-disable-next-line
  }, [joined, camOn, micOn]);

  // Connect to signaling server
  const connectSocket = (stream) => {
    socketRef.current = io(SIGNAL_SERVER_URL);
    socketRef.current.emit("join-room", roomCode);

    socketRef.current.on("all-users", (users) => {
      users.forEach((userId) => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        setPeers((prev) => ({ ...prev, [userId]: peer }));
      });
    });

    socketRef.current.on("user-joined", (userId) => {
      console.log(userId, "joined the room");
      // Existing users should NOT create an offer here. Only the new user creates offers to existing users.
      // Do nothing here.
    });

    socketRef.current.on("signal", async ({ from, data }) => {
      let peer = peersRef.current[from];
      if (!peer) {
        // Only create a peer connection, do not create an offer
        peer = addPeer(from, localStreamRef.current);
        setPeers((prev) => ({ ...prev, [from]: peer }));
      }
      if (data.sdp) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        // Add any queued ICE candidates
        if (pendingCandidates.current[from]) {
          for (const candidate of pendingCandidates.current[from]) {
            try {
              await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Error adding queued ICE candidate:", e);
            }
          }
          delete pendingCandidates.current[from];
        }
        if (data.sdp.type === "offer") {
          // Clear any old ICE candidates for this peer
          pendingCandidates.current[from] = [];
          if (peer.signalingState === "have-remote-offer") {
            const answer = await peer.createAnswer();
            if (peer.signalingState === "have-remote-offer") {
              await peer.setLocalDescription(answer);
              socketRef.current.emit("signal", {
                to: from,
                data: { sdp: peer.localDescription },
              });
            } else {
              console.warn(
                "Signaling state changed before setLocalDescription(answer)",
                peer.signalingState
              );
            }
          } else {
            // Ignore or log, as we are not in the right state to answer
            console.warn(
              "Received offer but not in have-remote-offer state",
              peer.signalingState
            );
          }
        } else if (data.candidate) {
          if (peer.remoteDescription && peer.remoteDescription.type) {
            try {
              await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
              console.error("Error adding received ICE candidate:", e);
            }
          } else {
            // Queue the candidate until remoteDescription is set
            if (!pendingCandidates.current[from])
              pendingCandidates.current[from] = [];
            pendingCandidates.current[from].push(data.candidate);
          }
        }
      } else if (data.candidate) {
        if (peer.remoteDescription && peer.remoteDescription.type) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error("Error adding received ICE candidate:", e);
          }
        } else {
          // Queue the candidate until remoteDescription is set
          if (!pendingCandidates.current[from])
            pendingCandidates.current[from] = [];
          pendingCandidates.current[from].push(data.candidate);
        }
      }
    });

    socketRef.current.on("user-left", (userId) => {
      setRemoteStreams((prev) => prev.filter((s) => s.id !== userId));
      if (peers[userId]) {
        peers[userId].close();
        setPeers((prev) => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
      }
    });
  };
  console.log(connectSocket);

  // Create peer connection and send offer
  const createPeer = (userIdToCall, callerId, stream) => {
    const peer = new RTCPeerConnection(iceServers);
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("signal", {
          to: userIdToCall,
          data: { candidate: e.candidate },
        });
      }
    };
    peer.ontrack = (e) => {
      setRemoteStreams((prev) => {
        let found = prev.find((s) => s.id === userIdToCall);
        let remoteStream;
        if (found) {
          remoteStream = found.stream;
        } else {
          remoteStream = new MediaStream();
        }
        e.streams[0].getTracks().forEach((track) => {
          if (!remoteStream.getTracks().some((t) => t.id === track.id)) {
            remoteStream.addTrack(track);
          }
        });
        const others = prev.filter((s) => s.id !== userIdToCall);
        return [...others, { id: userIdToCall, stream: remoteStream }];
      });
    };
    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .then(() => {
        socketRef.current.emit("signal", {
          to: userIdToCall,
          data: { sdp: peer.localDescription },
        });
      });
    return peer;
  };

  // Add peer connection for incoming offer
  const addPeer = (userId, stream) => {
    let useStream = stream;
    if (!useStream && (camOn || micOn)) {
      navigator.mediaDevices
        .getUserMedia({ video: camOn, audio: micOn })
        .then((newStream) => {
          localStreamRef.current = newStream;
          useStream = newStream;
        });
    }
    const peer = new RTCPeerConnection(iceServers);
    if (useStream) {
      useStream.getTracks().forEach((track) => peer.addTrack(track, useStream));
    }
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("signal", {
          to: userId,
          data: { candidate: e.candidate },
        });
      }
    };
    peer.ontrack = (e) => {
      setRemoteStreams((prev) => {
        let found = prev.find((s) => s.id === userId);
        let remoteStream;
        if (found) {
          remoteStream = found.stream;
        } else {
          remoteStream = new MediaStream();
        }
        e.streams[0].getTracks().forEach((track) => {
          if (!remoteStream.getTracks().some((t) => t.id === track.id)) {
            remoteStream.addTrack(track);
          }
        });
        const others = prev.filter((s) => s.id !== userId);
        return [...others, { id: userId, stream: remoteStream }];
      });
    };
    return peer;
  };

  const handleJoin = () => {
    if (roomCode.trim()) {
      setJoined(true);
    }
  };

  const toggleMic = () => {
    setMicOn((prev) => {
      const newState = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => {
          if (newState) {
            t.enabled = true;
          } else {
            t.stop();
          }
        });
      }
      return newState;
    });
  };
  const toggleCam = () => {
    setCamOn((prev) => {
      const newState = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => {
          if (newState) {
            t.enabled = true;
          } else {
            // Remove the video track from all peer connections
            Object.values(peersRef.current).forEach((peer) => {
              peer.getSenders().forEach((sender) => {
                if (sender.track && sender.track.kind === "video") {
                  peer.removeTrack(sender);
                }
              });
            });
            t.stop();
          }
        });
        // Do NOT set localStreamRef.current = null here; just remove video tracks
        if (localVideoRef.current && !newState)
          localVideoRef.current.srcObject = null;
      }
      return newState;
    });
  };
  const toggleHand = () => {
    setHandRaised((prev) => {
      const newState = !prev;
      if (socketRef.current) {
        socketRef.current.emit("raise-hand", roomCode);
      }
      return newState;
    });
  };

  // Keep peersRef in sync with peers state
  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!joined ? (
        <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Join Classroom Meeting</h2>
          <input
            type="text"
            placeholder="Enter Classroom Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="border p-2 rounded mb-4 w-64"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white p-6 rounded shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Classroom: {roomCode}</h2>
          <div className="flex gap-8 mb-6">
            <div>
              <p className="text-center mb-2">You</p>
              {camOn && localStreamRef.current ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-64 h-48 bg-black rounded"
                />
              ) : (
                <div className="w-64 h-48 bg-black rounded flex items-center justify-center text-white">
                  NO VIDEO
                </div>
              )}
            </div>
            {remoteStreams.map(({ id, stream }) => {
              // Check if the remote stream has a live video track
              let hasLiveVideo = false;
              if (stream) {
                const videoTracks = stream.getVideoTracks();
                hasLiveVideo =
                  videoTracks.length > 0 &&
                  videoTracks.some((track) => track.readyState === "live");
              }
              return (
                <div key={id}>
                  <p className="text-center mb-2">User: {id.slice(-5)}</p>
                  {hasLiveVideo ? (
                    <VideoPlayer stream={stream} />
                  ) : (
                    <div className="w-64 h-48 bg-black rounded flex items-center justify-center text-white">
                      Video Off
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded ${
                micOn ? "bg-green-500" : "bg-gray-400"
              } text-white`}
            >
              {micOn ? "Mic On" : "Mic Off"}
            </button>
            <button
              onClick={toggleCam}
              className={`px-4 py-2 rounded ${
                camOn ? "bg-green-500" : "bg-gray-400"
              } text-white`}
            >
              {camOn ? "Camera On" : "Camera Off"}
            </button>
            <button
              onClick={toggleHand}
              className={`px-4 py-2 rounded ${
                handRaised ? "bg-yellow-500" : "bg-gray-400"
              } text-white`}
            >
              {handRaised ? "Hand Raised" : "Raise Hand"}
            </button>
          </div>
          {/* Placeholder for chat/messages, participants list, etc. */}
        </div>
      )}
    </div>
  );
};

// Helper component for remote video
const VideoPlayer = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-64 h-48 bg-black rounded"
    />
  );
};

export default MainVid;

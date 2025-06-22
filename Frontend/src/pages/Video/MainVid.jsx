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

  // Get user media when joined
  useEffect(() => {
    if (joined) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          connectSocket(stream);
        })
        .catch((err) => {
          alert("Could not access camera/mic: " + err.message);
        });
    }
    // Cleanup on leave
    return () => {
      if (!joined && localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [joined]);

  // Connect to signaling server
  const connectSocket = (stream) => {
    socketRef.current = io(SIGNAL_SERVER_URL);
    socketRef.current.emit("join-room", roomCode);

    socketRef.current.on("all-users", (users) => {
      // Create offer for each existing user
      users.forEach((userId) => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        setPeers((prev) => ({ ...prev, [userId]: peer }));
      });
    });

    socketRef.current.on("user-joined", (userId) => {
      console.log("User joined:", userId);
      // New user joined, wait for their offer
    });

    socketRef.current.on("signal", async ({ from, data }) => {
      let peer = peers[from];
      if (!peer) {
        peer = addPeer(from, stream);
        setPeers((prev) => ({ ...prev, [from]: peer }));
      }
      if (data.sdp) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === "offer") {
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socketRef.current.emit("signal", {
            to: from,
            data: { sdp: peer.localDescription },
          });
        }
      } else if (data.candidate) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding received ICE candidate:", e);
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

  // Create peer connection and send offer
  const createPeer = (userIdToCall, callerId, stream) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
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
        if (prev.find((s) => s.id === userIdToCall)) return prev;
        return [...prev, { id: userIdToCall, stream: e.streams[0] }];
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
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
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
        if (prev.find((s) => s.id === userId)) return prev;
        return [...prev, { id: userId, stream: e.streams[0] }];
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
        localStreamRef.current
          .getAudioTracks()
          .forEach((t) => (t.enabled = newState));
      }
      return newState;
    });
  };
  const toggleCam = () => {
    setCamOn((prev) => {
      const newState = !prev;
      if (localStreamRef.current) {
        localStreamRef.current
          .getVideoTracks()
          .forEach((t) => (t.enabled = newState));
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
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-64 h-48 bg-black rounded"
              />
            </div>
            {remoteStreams.map(({ id, stream }) => (
              <div key={id}>
                <p className="text-center mb-2">User: {id.slice(-5)}</p>
                <VideoPlayer stream={stream} />
              </div>
            ))}
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

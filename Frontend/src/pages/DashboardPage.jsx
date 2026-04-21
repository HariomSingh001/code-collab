import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

import { mockActiveSessions, mockRecentSessions } from "../data/mockSessions";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [isCreating, setIsCreating] = useState(false);

  // TODO: replace mock data with real hooks (useActiveSessions / useMyRecentSessions)
  const activeSessions = mockActiveSessions;
  const recentSessions = mockRecentSessions;
  const loadingActive = false;
  const loadingRecent = false;

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    setIsCreating(true);
    // simulate API call
    setTimeout(() => {
      setIsCreating(false);
      setShowCreateModal(false);
      toast.success("Session created!");
      const fakeId = Math.random().toString(36).slice(2, 8);
      navigate(`/session/${fakeId}`);
    }, 700);
  };

  return (
    <>
      <div className="min-h-screen bg-base-200/40">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActive}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecent} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={isCreating}
      />
    </>
  );
};

export default DashboardPage;

// app/root/meeting/[id]/layout.tsx
import type { Metadata } from "next";
import MeetingRoomWrapper from "@/components/MeetingRoomWrapper";
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Grace Meet",
  description: "Video Calling App",
  icons: {
    icon: "/icons/white-logo.png",
  },
};

const MeetingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <MeetingRoomWrapper>
        {children}
        <Toaster />
      </MeetingRoomWrapper>
    </main>
  );
};

export default MeetingLayout;

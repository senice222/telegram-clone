import React, { useState, useEffect, useRef } from "react";
import { Member } from "@/types/Group";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, CircleUserRound, Gavel, Ellipsis, Crown } from "lucide-react";
import { useChangeMemberRole } from "@/hooks/use-change-member-role";
import { User } from "@/types/User";

const Members = ({ members, profile }: { members: Member[], profile: User }) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const currentMember = members.find((member: Member) => member.profile.id === profile.id) as Member;
  const togglePopover = (memberId: string) => {
    setActivePopover(activePopover === memberId ? null : memberId);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setActivePopover(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { mutate } = useChangeMemberRole();

  const onRoleChange = (role: string, memberId: string, groupId: string) => {
    const payload = { groupId, profileId: profile.id, memberId, role };
    mutate(payload);
    setActivePopover(null);
  };

  const onKickMember = (memberId: string) => {
    console.log(`Kicking member ${memberId}`);
    setActivePopover(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {members.map((member: Member, i: number) => (
        <div
          key={i}
          className="relative w-[100%] p-1 pr-5 cursor-pointer flex items-center justify-between hover:bg-[rgb(44,44,44)] transition"
        >
          <div className="flex items-center">
            <div className="ml-2 relative">
              <img
                src={member.profile.imageUrl}
                alt="Avatar"
                height={40}
                width={40}
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              {member.profile.online === "online" && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0ac630] rounded-full border-2 border-[rgb(33,33,33)]"></span>
              )}
            </div>
            <div className="flex flex-col ml-3">
              <div className="flex gap-2 items-center sender-name font-medium text-[rgb(233,238,244)] mr-1">
                {member.profile.name}
                {member.role === "ADMIN" && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                {member.role === "MODERATOR" && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
                {member.role === "MEMBER" && (
                  <CircleUserRound className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          {
            (currentMember.role === "MODERATOR" || currentMember.role === "ADMIN" && currentMember.id !== member.id) && (
              <button
                className="text-white/[0.7] hover:text-white focus:outline-none"
                onClick={() => togglePopover(member.id)}
              >
                <Ellipsis className="w-5 h-5" />
              </button>
            )
          }
          {activePopover === member.id && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 bg-black text-white p-2 rounded shadow-lg z-10"
            >
              <div className="flex flex-col">
                {
                  currentMember.role === "ADMIN" && (
                    <>
                      <div className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded" onClick={() => onRoleChange("MEMBER", member.id, member.groupId)}>
                        <Shield className="h-4 w-4 mr-2 text-light-blue" />
                        <span>Guest</span>
                      </div>
                      <div className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded" onClick={() => onRoleChange("MODERATOR", member.id, member.groupId)}>
                        <ShieldCheck className="h-4 w-4 mr-2 text-red" />
                        <span>Moderator</span>
                      </div>
                    </>
                  )
                }
                {
                  currentMember.role === "MODERATOR" || currentMember.role === "ADMIN" && (
                    <>
                      <div className="border-t border-gray-600 my-1"></div>
                      <div className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded" onClick={() => onKickMember(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        <span>Kick</span>
                      </div>
                    </>
                  )
                }
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Members;

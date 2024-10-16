import React from "react";
import { X } from "lucide-react";
import Media from "./chat-tabs/media";
import Files from "./chat-tabs/files";
import Links from "./chat-tabs/links";
import { Tabs, Tab } from "@nextui-org/tabs";
import { isChannel, isConversation, isGroup } from "@/lib/utils";
import { User } from "@/types/User";
import { ChannelType, ChatData } from "@/types/Channel";

interface RightPanelProps {
  isMenuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  channelData: ChatData;
  profile: User
}

const RightPanel = ({
  isMenuOpen,
  setMenuOpen,
  menuRef,
  channelData,
  profile
}: RightPanelProps) => {
  if (!channelData) return null;

  const otherUser: User | undefined =
    isConversation(channelData)
      ? (profile.id === channelData.memberOne.id ? channelData.memberTwo : channelData.memberOne)
      : undefined
  const backgroundImageUrl = isChannel(channelData) || isGroup(channelData) ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${channelData.image}` : otherUser?.imageUrl


  return (
    <div
      ref={menuRef}
      className={`fixed top-0 h-full overflow-hidden w-[25vw] max-2xl:w-[25rem] max-sm:w-[100vw] bg-[#212121] max-h-[100vh] overflow-y-auto border-l-[1px] border-[#303030] shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? "right-[0]" : "right-[-25vw] max-2xl:right-[-25rem] max-sm:right-[-100vw]"
        }`}
    >
      <div className="flex items-center flex-col ">
        <div className="h-[56px] w-full flex items-center">
          <div
            onClick={() => setMenuOpen(false)}
            className="ml-[10px] flex w-[40px] h-[40px] items-center justify-center rounded-full hover:bg-[#aaaaaa]/[.08] transition-colors duration-200"
          >
            <X color="rgb(170, 170, 170)" />
          </div>
          <h2 className="ml-[25px] text-white text-xl font-medium">User Info</h2>
        </div>
        <div
          className="w-[25vw] h-[25vw] flex flex-col justify-end bg-cover object-cover"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
          }}
        >
          <div className={`ml-[20px] mb-[10px] transition-opacity duration-300`}>
            <h1 className="text-white whitespace-pre font-medium text-[18px] text-lg leading-5">
              {isConversation(channelData) ? otherUser?.name : channelData.name}
            </h1>
            <p className="text-[#aaaaaa] font-normal text-sm leading-4 mt-[3px]">
              {isConversation(channelData)
                ? "last seen 1m ago"
                : isGroup(channelData)
                  ? `${channelData.members.length} members`
                  : `${channelData.members.length} subscribers`}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <Tabs className="mt-2" variant="underlined" color="success" aria-label="Options" fullWidth>
            <Tab key="media" title="Media">
              <Media />
            </Tab>
            <Tab key="files" title="Files">
              <Files />
            </Tab>
            <Tab key="links" title="Links">
              <Links />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

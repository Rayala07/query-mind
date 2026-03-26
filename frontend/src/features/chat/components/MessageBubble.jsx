import userProfileImg from "../../../assets/user_profile.jpeg";
import aiLogoImg from "../../../assets/ai_logo.png";

const MessageBubble = ({ message, isUser }) => {
  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 w-full">
        <div className="max-w-[65%] bg-[#141414] border border-white/[0.07] rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 mt-0.5">
          <img
            src={userProfileImg}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-[#141414] border border-white/[0.08] mt-0.5 flex items-center justify-center">
        <img
          src={aiLogoImg}
          alt="AI"
          className="w-5 h-5 object-contain"
        />
      </div>
      <div className="max-w-[65%] bg-[#0f0f0f] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3">
        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;

import { Avatar, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
  
  const avatarImage = `https://avatar.iran.liara.run/username?username=${'J'}`

  return (
    <div className="px-5 py-3 mt-1 font-work-sans">
      <nav className="flex justify-end items-center">
          <Avatar className="size-10 bg-gray-200 ml-5">
            <AvatarImage src={avatarImage} />
          </Avatar>
      </nav>
    </div>
  );
};

export default Navbar;

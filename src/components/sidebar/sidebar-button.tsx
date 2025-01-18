import Image from "next/image";

type SidebarButtonProps = {
  onClick: () => void;
  path: string;
  alt: string;
};
export default function SidebarButton({
  onClick,
  path,
  alt,
}: SidebarButtonProps) {
  return (
    <button onClick={onClick} className="p-5">
      <Image className="invert" src={path} alt={alt} width={24} height={24} />
    </button>
  );
}

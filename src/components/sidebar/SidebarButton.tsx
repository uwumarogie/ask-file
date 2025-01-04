import Image from "next/image";


export default function SidebarButton({ onClick, path, alt }: { onClick: () => void, path: string, alt: string }) {

    return (
        <button onClick={onClick} className="p-5">
            <Image
                className="invert"
                src={path}
                alt={alt}
                width={24}
                height={24}
            />
        </button>
    )

}


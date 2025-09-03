import Image from "next/image"

const Logo: React.FC = () => {
    return (
        <div className="text-white font-bold uppercase">
            <Image src={"/ishop.png"} alt="Ishop" height={150} width={150} />
        </div>
    )
}

export default Logo

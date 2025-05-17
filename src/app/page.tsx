import Image from "next/image";
import DigitalPostcard from '../components/digipostcard';
import PasswordModal from "@/components/passwordinput";
import tulips from '../../public/tulips.png'

export default function Home() {
  return (
    <div className="">
      <PasswordModal>
        <DigitalPostcard/>

        <div
          className="absolute bottom-[-10px] left-0 w-full h-[120px] z-10"
          style={{
            backgroundImage: `url(${tulips.src})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100px',
            backgroundPosition: 'bottom',
          }}
        />
      </PasswordModal>
    </div>
  );
}
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full h-full">
      <Link href='/order' className="sm:p-20 border w-1/2 flex justify-center items-center">
        <div>주문페이지</div>
      </Link>
      <Link href='/dashboard' className="sm:p-20 borde w-1/2 flex justify-center items-center">
        <div>주문현황</div>
      </Link>
    </div >
  );
}

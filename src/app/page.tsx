import Advantages from "@/components/advantages/advantage";
import Controls from "@/components/controls/controls";
import Preview from "@/components/preview/preview";
import Upload from "@/components/upload/upload";

export default function Home() {
  return (
    <>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="self-center text-center text-2xl sm:text-4xl font-bold dark:text-red-600">shrinkPic image resizer</h1>
        <h2 className="self-center text-center text-lg sm:text-2xl mt-2">Compress and resize images instantly</h2>
        <div className=" w-full h-6 sm:h-10"></div>
        <Upload />
        <div className="grid lg:grid-cols-3 gap-6">
          <Preview />
          <Controls />
        </div>
        <Advantages />
      </main>

    </>

  );
}

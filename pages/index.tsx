export default function Home() {
    return (
        <div className="bg-background_green from-green-300 via-yellow-300 to-pink-300 h-screen flex flex-col justify-center items-center gap-12">
            <div className="border-2 border-pale_yellow rounded-lg h-screen w-screen m-4 flex flex-col justify-center items-center gap-12">
                <img src="logo.gif" alt="logo" className="w-[800px]"/>
                <a href='/game' className="text-pale_yellow border-pale_yellow border-2 px-4 py-2 rounded-lg font-bold hover:bg-pale_yellow hover:text-background_green hover:cursor-pointer transition-all duration-300 transform hover:translate-y-2">
                    START GAME
                </a>
            </div>
        </div>
    );
}

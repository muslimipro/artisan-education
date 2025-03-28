const InstagramFeed = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-300 p-8 h-full flex flex-col">
            <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200">
                <iframe
                    src="https://www.instagram.com/artisan.education/embed"
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                ></iframe>
            </div>
        </div>
    );
};

export default InstagramFeed; 
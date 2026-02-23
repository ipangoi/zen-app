export default function Background() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
            <video
                autoPlay
                loop
                muted
                className="backVideo"
                disablePictureInPicture
                >
                <source src="/bg-2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
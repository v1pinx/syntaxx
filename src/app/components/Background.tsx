export default function Background() {
    return (
        <>
            <div
                className="absolute inset-0 animate-[fadeIn_1s_ease-in]"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '45px 45px'
                }}
            />

            <div
                className="absolute -top-40 left-1/3 -translate-x-1/2 w-[1000px] h-[500px] animate-[pulse_4s_ease-in-out_infinite]"
                style={{
                    background: 'radial-gradient(circle, rgba(255,223,0,0.15) 0%, rgba(255,223,0,0) 70%)',
                    filter: 'blur(40px)'
                }}
            />

            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] animate-[fadeIn_1.5s_ease-in]"
                style={{
                    background: 'linear-gradient(to bottom, rgba(14,19,19,0) 0%, rgba(14,19,19,1) 100%)'
                }}
            />
        </>
    )
}
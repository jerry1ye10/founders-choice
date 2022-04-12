export default ({ className, size = 36, children }) => {
    return <>
        <div className={`flex flex-col justify-center items-center ${className}`}>
            <div
                className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-gray-900`}
            />
            {children}
        </div>
    </>
}
import React from "react"

export function Button({
    children,
    className
}) {
    return <button
        className={`z-50 raleway font-light text-4xl bg-white rounded-full border-2 border-black p-8 py-4 mt-8 ${className}`}
        href="/login"
      >
        {children}
    </button>
}

export function Link({
    children,
    className = ""
}) {
    return <a
        className={`z-50 raleway font-light text-4xl bg-white rounded-full border-2 border-black p-8 py-4 mt-8 ${className}`}
        href="/login"
      >
        {children}
    </a>
}
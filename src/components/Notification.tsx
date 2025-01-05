"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type NotificationType = "success" | "error" | "warning" | "info"

interface INotification {
    message: string
    type: NotificationType
    id: number
}

interface INotificationContext {
    showNotification: (message: string, type: NotificationType) => void
}

const NotificationContext = createContext<INotificationContext | undefined>(
    undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<INotification | null>(null)

    const showNotification = (message: string, type: NotificationType) => {
        const id = Date.now()
        setNotification({ message, type, id })
        setTimeout(() => {
            setNotification(current => (current?.id === id ? null : current))
        }, 3000)
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className="toast toast-bottom toast-end z-[100]">
                    <div
                        className={`alert ${getAlertClass(notification.type)}`}
                    >
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    )
}

function getAlertClass(type: NotificationType): string {
    switch (type) {
        case "success":
            return "alert-success"
        case "error":
            return "alert-error"
        case "warning":
            return "alert-warning"
        case "info":
            return "alert-info"
        default:
            return "alert-info"
    }
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        )
    }
    return context
}

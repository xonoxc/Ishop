"use client"
import { RequestStatus } from "@/types/requestStatus"
import { IKUpload } from "imagekitio-next"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import React, { useState } from "react"

interface IFileUploadProps {
    onSuccessAction: (response: IKUploadResponse) => void
}

export default function FileUpload({ onSuccessAction }: IFileUploadProps) {
    const [uploadStatus, setUploadStatus] = useState<RequestStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleError = (err: { message: string }) => {
        setErrorMessage(err.message)
        setUploadStatus("error")
    }

    const handleSuccess = (res: IKUploadResponse) => {
        setUploadStatus("success")
        setErrorMessage(null)
        onSuccessAction(res)
    }

    const handleUploadStart = () => {
        setUploadStatus("pending")
        setErrorMessage(null)
    }

    return (
        <div className="space-y-2">
            <IKUpload
                fileName="test-upload.png"
                onError={handleError}
                onSuccess={handleSuccess}
                onUploadStart={handleUploadStart}
                validateFile={(file: File) => {
                    const validTypes = ["image/png", "image/jpeg", "image/webp"]
                    if (!validTypes.includes(file.type)) {
                        setErrorMessage("Invalid file type")
                        return false
                    }

                    if (file.size > 5 * 1024 * 1024) {
                        setErrorMessage("file is too large")
                        return false
                    }

                    return true
                }}
            />

            {uploadStatus === "pending" && (
                <p className="text-sm text-gray-500">Uploading...</p>
            )}

            {uploadStatus === "error" && (
                <p className="text-sm text-red-500">{errorMessage}</p>
            )}
        </div>
    )
}

"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onUploadStart?: () => void
    onUploadError?: (error: Error) => void
    className?: string
}

export function ImageUpload({ value, onChange, onUploadStart, onUploadError, className }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        // Basic validation
        if (!file.type.startsWith('image/')) {
            onUploadError?.(new Error("Please upload an image file"))
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            onUploadError?.(new Error("Image must be smaller than 5MB"))
            return
        }

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        setIsUploading(true)
        onUploadStart?.()

        try {
            // Import dynamically to avoid SSR issues if used in edge Runtime
            const { uploadEventImage } = await import('@/lib/supabase/storage')
            const publicUrl = await uploadEventImage(file)
            setPreviewUrl(publicUrl)
            onChange(publicUrl)
        } catch (error) {
            console.error('Upload failed:', error)
            setPreviewUrl(null) // Revert preview on failure
            onUploadError?.(error instanceof Error ? error : new Error("Failed to upload image"))
        } finally {
            setIsUploading(false)
            // Cleanup object URL
            URL.revokeObjectURL(objectUrl)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setPreviewUrl(null)
        onChange("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className={className}>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onFileInput}
                disabled={isUploading}
            />

            {previewUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-border aspect-video md:aspect-[21/9] bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewUrl}
                        alt="Event cover"
                        className={cn(
                            "w-full h-full object-cover transition-opacity duration-300",
                            isUploading ? "opacity-50 blur-sm" : "opacity-100"
                        )}
                    />

                    {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-sm font-medium">Fazendo upload...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleClear}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" /> Remover Imagem
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={cn(
                        "relative flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed rounded-xl cursor-pointer transition-all aspect-video md:aspect-[21/9]",
                        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
                        isUploading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="text-sm font-semibold tracking-tight">
                            Clique para enviar
                            <span className="font-normal text-muted-foreground"> ou arraste a imagem aqui</span>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP até 5MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

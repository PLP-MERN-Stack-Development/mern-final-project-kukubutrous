//frontend/src/
import React, { useRef, useState } from 'react';

export default function FileUpload({ onFile, accept = 'image/*,video/*,audio/*,application/pdf' }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleFiles = (file) => {
        if (!file) return;
        setPreview({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type,
            url: URL.createObjectURL(file)
        });
        onFile && onFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        handleFiles(f);
    };

    return (
        <div>
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-2 border border-dashed rounded text-center cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                <div className="text-sm text-muted">Drag & drop file here or click to select</div>
                <div className="text-xs text-muted mt-1">Supported: images, video, audio, pdf</div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files?.[0])}
                />
            </div>

            {preview && (
                <div className="mt-2 p-2 bg-white rounded shadow-sm flex items-center gap-2">
                    {preview.type.startsWith('image/') && <img src={preview.url} alt="preview" className="w-16 h-16 object-cover rounded" />}
                    {preview.type.startsWith('video/') && <video src={preview.url} className="w-24 h-16 object-cover" />}
                    {preview.type.startsWith('audio/') && <div className="w-24"><audio controls src={preview.url} /></div>}
                    {!preview.type.startsWith('image|video|audio') && <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">FILE</div>}

                    <div className="flex-1">
                        <div className="font-semibold">{preview.name}</div>
                        <div className="text-xs text-muted">{preview.size}</div>
                    </div>

                    <button className="btn btn-danger text-sm" onClick={() => { setPreview(null); onFile(null); }}>Remove</button>
                </div>
            )}
        </div>
    );
}

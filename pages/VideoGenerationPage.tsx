
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card, { ScrollAnimator } from '../components/ui/Card';
import { generateVideoFromImage } from '../services/geminiService';
import { RobotIcon } from '../components/icons/Icons';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const VideoGenerationPage: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadingMessages = [
        "Initializing creative matrix...",
        "Calibrating temporal synthesizer...",
        "Engaging Veo generation engine...",
        "Rendering photorealistic sequences...",
        "This can take a few minutes, please wait...",
        "Assembling final video frames...",
        "Almost there, finalizing the masterpiece...",
    ];

    const checkApiKey = useCallback(async () => {
        if (window.aistudio) {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            setLoadingMessage(loadingMessages[i]);
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 5000);
        }
        return () => window.clearInterval(interval);
    }, [isLoading, loadingMessages]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setGeneratedVideoUrl(null);
            setError(null);
        } else {
            setError("Please select a valid image file.");
        }
    };
    
    const handleGenerate = async () => {
        if (!image) {
            setError("Please upload an image first.");
            return;
        }

        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            setApiKeySelected(false);
            setError("API Key not selected. Please select a key to proceed.");
            return;
        }
        setApiKeySelected(true);
        
        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            const base64Image = await blobToBase64(image);
            const videoBlob = await generateVideoFromImage(base64Image, image.type, prompt, aspectRatio);
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);
        } catch (e: any) {
            console.error(e);
            let errorMessage = "An unexpected error occurred during video generation.";
            if (e?.message) {
                errorMessage = e.message;
            }
            if (e?.message?.includes("Requested entity was not found")) {
                errorMessage = "Your API key might be invalid or missing permissions. Please select a valid API key and try again.";
                setApiKeySelected(false);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true);
        setError(null);
    };

    if (!apiKeySelected) {
        return (
            <Card className="flex flex-col items-center justify-center text-center h-full">
                <RobotIcon className="w-16 h-16 text-neon-blue mb-4" />
                <h2 className="text-2xl font-bold mb-2">API Key Required for Veo</h2>
                <p className="max-w-md mb-4 text-gray-400">
                    To use the video generation feature, you must select an API key. This is a mandatory step for accessing Veo models.
                </p>
                <p className="max-w-md mb-6 text-sm text-gray-500">For more information on billing, please visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-neon-blue underline">official documentation</a>.</p>
                <button onClick={handleSelectKey} className="px-6 py-3 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">
                    Select API Key
                </button>
                 {error && <p className="mt-4 text-red-400">{error}</p>}
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <ScrollAnimator>
                <h2 className="text-2xl font-bold">Video Generation Studio</h2>
            </ScrollAnimator>
            <ScrollAnimator delay={150}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">1. Upload Starting Image</h3>
                            <div 
                                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-neon-blue transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                {imagePreview ? (
                                    <p>Image selected: <span className="font-semibold text-neon-green">{image?.name}</span>. Click here to change.</p>
                                ) : (
                                    <p>Click or drag & drop an image here</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">2. Add a Prompt (Optional)</h3>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A neon hologram of this object driving at top speed"
                                className="w-full h-24 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-gray-600 focus:border-neon-blue focus:ring-0"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">3. Configure Settings</h3>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Aspect Ratio</label>
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                                className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-gray-600 focus:border-neon-blue focus:ring-0"
                                disabled={isLoading}
                            >
                                <option value="16:9">16:9 (Landscape)</option>
                                <option value="9:16">9:16 (Portrait)</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !image}
                            className="w-full py-3 px-4 rounded-lg bg-neon-blue text-black font-bold hover:shadow-neon-blue transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generating Video...' : 'Generate Video'}
                        </button>

                    </Card>

                    <Card className="flex items-center justify-center min-h-[400px]">
                        {isLoading ? (
                            <div className="text-center">
                                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-blue mx-auto"></div>
                                 <p className="mt-4 font-semibold">{loadingMessage}</p>
                            </div>
                        ) : error ? (
                             <div className="text-center text-red-400">
                                <p className="font-bold">Generation Failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : generatedVideoUrl ? (
                             <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-lg" />
                        ) : imagePreview ? (
                             <img src={imagePreview} alt="Preview" className="max-w-full max-h-full rounded-lg" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Your generated video will appear here.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </ScrollAnimator>
        </div>
    );
};

export default VideoGenerationPage;

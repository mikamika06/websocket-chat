import React, { useState, useRef, useEffect } from 'react';

export type PersonaType = 
    | 'general'
    | 'einstein'
    | 'sherlock'
    | 'ironman'
    | 'shakespeare'
    | 'musk';

interface PersonaSelectorProps {
    currentPersona: PersonaType;
    setPersona: (persona: PersonaType) => void;
}

const personas: Record<PersonaType, { name: string; description: string }> = {
    general: {
        name: 'Assistant',
        description: 'Ordinary friendly AI assistant',
    },
    einstein: {
        name: 'Einstein',
        description: 'Physics genius, explains complex things simply',
    },
    sherlock: {
        name: 'Sherlock',
        description: 'Detective with deductive reasoning',
    },
    ironman: {
        name: 'Tony Stark',
        description: 'Brilliant inventor with sarcastic humor',
    },
    shakespeare: {
        name: 'Shakespeare',
        description: 'Poet, speaks elegantly and metaphorically',
    },
    musk: {
        name: 'Elon Musk',
        description: 'Visionary, dreams of Mars and the future',
    },
};

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ currentPersona, setPersona }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentPersonaData = personas[currentPersona];

    return (
        <div className="relative mb-3" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="text-left">
                        <div className="font-semibold text-gray-800 dark:text-white">
                            {currentPersonaData.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {currentPersonaData.description}
                        </div>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                            Select a character:
                        </div>
                        {Object.entries(personas).map(([key, persona]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setPersona(key as PersonaType);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                                    currentPersona === key
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{persona.name}</div>
                                    <div className={`text-xs truncate ${
                                        currentPersona === key ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {persona.description}
                                    </div>
                                </div>
                                {currentPersona === key && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { personas };

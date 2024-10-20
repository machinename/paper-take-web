'use client';

import { NoteHeaderTextField } from './Styled';

export interface GUIHeaderProps {
    focus: 'title' | 'body',
    setFocus: React.Dispatch<React.SetStateAction<'title' | 'body'>>,
    title: string,
    initialOperation: 'read' | 'create';
    isEditMode: boolean,
    isModalMode: boolean,
    handleTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    toggleModeTrue: () => void,
}

export default function GUIHeader({
    focus,
    setFocus,
    initialOperation,
    isEditMode,
    isModalMode,
    title,
    handleTitleChange,
    toggleModeTrue
}: GUIHeaderProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = 'Title...';

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setFocus('title');
    };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleModeTrue();
        }
    };

    return (
        <>
            {(isEditMode || title.length > 0) && (
                <NoteHeaderTextField
                    autoComplete='off'
                    inputProps={{
                        readOnly: readOnlyMode,
                    }}
                    multiline
                    onChange={handleTitleChange}
                    onClick={initialOperation === 'create' ? undefined : handleClick}
                    onFocus={handleFocus}
                    placeholder={placeholderText}
                    value={title}
                    sx={{
                        '& .MuiInputBase-input': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                        '& .MuiOutlinedInput-root': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                    }}

                    inputRef={input => {
                        if (input && isEditMode && focus === 'title') {
                            input.focus();   
                        }
                    }}
                />
            )}
        </>
    );
}
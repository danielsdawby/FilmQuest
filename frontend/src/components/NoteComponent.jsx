import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieNote, deleteMovieNote } from '../stores/slices/noteSlice';

const NoteComponent = ({ movieId, notes }) => {
    const [noteText, setNoteText] = useState('');
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleAddNote = () => {
        if (noteText.trim()) {
            if (user && user._id) {
                dispatch(addMovieNote({ userId: user._id, movieId: movieId, note: noteText }));
                setNoteText('');
            } else {
                console.error("User ID is missing.");
            }
        }
    };

    const handleDeleteNote = (noteId) => {
        dispatch(deleteMovieNote(noteId));
    };

    return (
        <div className="p-4 rounded-md shadow-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h4 className="text-lg font-semibold mb-2">Мои заметки:</h4>
            <div className="mb-4">
                <textarea
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                    placeholder="Добавьте заметку"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                    className="mt-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                    onClick={() => {
                        handleAddNote();
                    }}
                >
                    Добавить заметку
                </button>
            </div>
            <div>
                {notes && notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note._id}
                            className="mb-2 p-3 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-between"
                        >
                            <span>{note.note}</span>
                            <button
                                className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
                                onClick={() => handleDeleteNote(note._id)}
                            >
                                Удалить
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Нет заметок.</p>
                )}
            </div>
        </div>
    );
};

export default NoteComponent;

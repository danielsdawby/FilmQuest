import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieNote } from '../stores/slices/noteSlice';

const NoteModal = ({ movieId, onClose }) => {
    const [noteText, setNoteText] = useState('');
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleAddNote = () => {
        if (noteText.trim()) {
            if (user && user._id) {
                dispatch(addMovieNote({ userId: user._id, movieId: movieId, note: noteText }));
                setNoteText('');
                onClose(); 
            } else {
                console.error("User ID is missing.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Добавить заметку</h3>
                    <div className="mt-2">
                        <textarea
                            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите заметку"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
                            onClick={handleAddNote}
                        >
                            Добавить
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;

import Note from "../models/note.model.js";

export const addMovieNote = async (req, res) => {
    try {
        const { movieId, note } = req.body;
        const { userId } = req.body;

        if (!userId || !movieId || !note) {
            return res.status(400).json({ error: "Требуется указать ID пользователя, ID фильма и заметку." });
        }

        // Проверка на существование заметки для данного фильма
        const existingNote = await Note.findOne({ userId, movieId });

        if (existingNote) {
            return res.status(400).json({ error: "Заметка для этого фильма уже существует." });
        }

        // Создание новой заметки
        const newNote = new Note({
            userId,
            movieId,
            note
        });

        await newNote.save();
        res.status(201).json(newNote);  // Отправляем созданную заметку обратно на фронт
    } catch (error) {
        console.error("Ошибка при добавлении заметки к фильму:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const deleteMovieNote = async (req, res) => {
    const { movieId } = req.params;
    const { userId } = req.user;

    try {
        if (!userId || !movieId) {
            return res.status(400).json({ error: "Требуется указать ID пользователя и ID фильма." });
        }

        const deletedItem = await Note.findOneAndDelete({ movieId, userId });

        if (!deletedItem) {
            return res.status(404).json({ message: "Заметка не найдена." });
        }

        return res.status(200).json({ message: "Заметка успешно удалена." });
    } catch (error) {
        console.error("Ошибка при удалении заметки:", error.message);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

export const getOneMovieNote = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId } = req.user; // Исправлена опечатка

        if (!userId || !movieId) {
            return res.status(400).json({ error: "Требуется указать ID пользователя и ID фильма." });
        }

        const note = await Note.findOne({ userId, movieId });

        if (!note) {
            return res.status(404).json({ error: "Заметка не найдена." });
        }

        res.json({ note });
    } catch (error) {
        console.error("Ошибка при получении заметки:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const getMovieNote = async (req, res) => {
    try {
        const { userId } = req.user; // Исправлена опечатка

        if (!userId) {
            return res.status(400).json({ error: "Требуется указать ID пользователя." });
        }

        const notes = await Note.find({ userId }); // Получаем все заметки для пользователя

        if (notes.length === 0) {
            return res.status(404).json({ error: "Заметки не найдены." });
        }

        res.json({ notes });  // Отправляем все заметки
    } catch (error) {
        console.error("Ошибка при получении заметок:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};
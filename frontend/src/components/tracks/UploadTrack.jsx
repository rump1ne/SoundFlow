import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../../store/slices/playerSlice';

const UploadTrack = ({ onAddTrack }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [cover, setCover] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    } else {
      alert('Пожалуйста, выберите аудио файл');
    }
  };

  const handleCoverChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setCover(selectedFile);
    } else {
      alert('Пожалуйста, выберите изображение');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !artist) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setIsUploading(true);

    try {
      // Здесь должна быть логика загрузки файла на сервер
      // Для примера создадим локальный URL
      const trackUrl = URL.createObjectURL(file);
      const coverUrl = cover ? URL.createObjectURL(cover) : '/default-cover.jpg';

      const track = {
        title,
        artist,
        url: trackUrl,
        cover: coverUrl,
      };

      // Добавляем трек в список
      onAddTrack(track);

      // Воспроизводим трек
      dispatch(setCurrentTrack(track));

      // Очищаем форму
      setFile(null);
      setTitle('');
      setArtist('');
      setCover(null);
    } catch (error) {
      console.error('Error uploading track:', error);
      alert('Произошла ошибка при загрузке трека');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <div>
        <label className="block text-white mb-2">Название трека</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Введите название трека"
          disabled={isUploading}
        />
      </div>
      <div>
        <label className="block text-white mb-2">Исполнитель</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Введите имя исполнителя"
          disabled={isUploading}
        />
      </div>
      <div>
        <label className="block text-white mb-2">Музыкальный файл</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          disabled={isUploading}
        />
      </div>
      <div>
        <label className="block text-white mb-2">Обложка</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          disabled={isUploading}
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isUploading}
      >
        {isUploading ? 'Загрузка...' : 'Загрузить и воспроизвести'}
      </button>
    </form>
  );
};

export default UploadTrack; 
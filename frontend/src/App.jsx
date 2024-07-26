import { useEffect, useState } from 'react';
import Alert from './components/Alert';
import Preview from './components/Preview';

const App = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', e.target[0].files[0]);
      const res = await fetch('http://localhost:8080/file-upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const data = await res.json();
      setImage(data.location);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto'>
      <h1 className='text-center text-2xl'>File upload</h1>
      <form className='mt-5 w-1/3 mx-auto flex flex-col items-center gap-5' onSubmit={handleSubmit}>
        <input type='file' className='file-input input-bordered w-full' />
        {error ? (
          <Alert message={error} />
        ) : (
          <button type='submit' className='btn btn-block' disabled={loading}>
            Upload
          </button>
        )}
      </form>
      {image && <Preview image={image} />}
    </div>
  );
};

export default App;

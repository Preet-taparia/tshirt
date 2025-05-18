import { useState, useEffect, type ChangeEvent } from 'react';

// Define TypeScript interfaces
interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  font: string;
}

interface FormValues {
  height: number;
  weight: number;
  build: string;
  shirtText: string;
}

// Theme configurations
const themes: Theme[] = [
  {
    name: 'Classic',
    primary: '#3b82f6',
    secondary: '#f3f4f6',
    accent: '#111827',
    background: '#ffffff',
    text: '#1f2937',
    font: 'Poppins, sans-serif'
  },
  {
    name: 'Dark Mode',
    primary: '#8b5cf6',
    secondary: '#1f2937',
    accent: '#f3f4f6',
    background: '#111827',
    text: '#f9fafb',
    font: 'Inter, sans-serif'
  },
  {
    name: 'Vibrant',
    primary: '#ec4899',
    secondary: '#fdf2f8',
    accent: '#6d28d9',
    background: '#fffbeb',
    text: '#4c1d95',
    font: 'Lobster, cursive'
  },
  {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#f0f9ff',
    accent: '#0369a1',
    background: '#f0fdfa',
    text: '#0c4a6e',
    font: 'Roboto Slab, serif'
  }
];

function App() {
  const [currentTheme, setCurrentTheme] = useState<number>(0);
  const [shirtColor, setShirtColor] = useState<string>('#FFFFFF');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    height: 180,
    weight: 80,
    build: 'athletic',
    shirtText: ''
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Available t-shirt colors
  const colors: string[] = [
    '#FFFFFF', '#000000', '#FF0000', '#0000FF',
    '#FFFF00', '#00FF00', '#FFA500', '#800080',
    '#FF69B4', '#1ABC9C', '#D3D3D3', '#8B4513'
  ];

  // Build options
  const buildOptions: string[] = ['lean', 'regular', 'athletic', 'big'];

  const theme = themes[currentTheme];

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'q') {
        setCurrentTheme((prev) => (prev + 1) % themes.length);
        // Show theme change tooltip
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle file drop
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setPreviewImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (name: keyof FormValues, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500 overflow-x-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 animate-bounce"
          style={{
            backgroundColor: theme.primary,
            color: theme.background
          }}
        >
          Theme changed to {theme.name}!
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-8 opacity-0 animate-fade-in">
        <div className={`grid grid-cols-1 ${mobileView ? '' : 'md:grid-cols-2'}`}>
          {/* Preview Section */}
          <div className="flex flex-col gap-6 transform -translate-x-12 opacity-0 animate-slide-right">
            <div
              className="aspect-[4/5] rounded-2xl overflow-hidden p-4 md:p-8 flex items-center justify-center shadow-lg border hover:translate-y-1 hover:shadow-xl transition-all duration-500"
              style={{
                backgroundColor: theme.secondary,
                borderColor: theme.primary,
                boxShadow: `0 4px 20px ${theme.primary}22`
              }}
            >
              <div
                className="border-4 rounded-xl p-6 md:p-10 shadow-md flex justify-center items-center transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: theme.accent,
                  backgroundColor: theme.background,
                  boxShadow: `inset 0 2px 10px ${theme.accent}22`
                }}
              >
                <div className="relative">
                  <svg viewBox="0 0 200 220" className="w-48 h-56 md:w-64 md:h-72">
                    {/* T-shirt body */}
                    <path
                      d="M40,40 L70,10 H130 L160,40 L150,60 L140,50 V200 H60 V50 L50,60 Z"
                      fill={shirtColor}
                      stroke={theme.accent}
                      strokeWidth="2"
                    />
                    {/* Collar */}
                    <path
                      d="M70,10 Q100,30 130,10"
                      fill="none"
                      stroke={theme.accent}
                      strokeWidth="2"
                    />
                    {/* Sleeves */}
                    <path
                      d="M70,10 L40,40 L50,60"
                      fill="none"
                      stroke={theme.accent}
                      strokeWidth="2"
                    />
                    <path
                      d="M130,10 L160,40 L150,60"
                      fill="none"
                      stroke={theme.accent}
                      strokeWidth="2"
                    />
                    {/* Shirt folds - subtle details */}
                    <path
                      d="M100,50 L100,160"
                      fill="none"
                      stroke={shirtColor === '#FFFFFF' ? '#EFEFEF' : shirtColor === '#000000' ? '#222222' : shirtColor}
                      strokeWidth="1"
                      strokeDasharray="2,8"
                      opacity="0.5"
                    />
                    <path
                      d="M80,50 C90,70 90,100 80,120"
                      fill="none"
                      stroke={shirtColor === '#FFFFFF' ? '#EFEFEF' : shirtColor === '#000000' ? '#222222' : shirtColor}
                      strokeWidth="1"
                      strokeDasharray="1,10"
                      opacity="0.3"
                    />
                    <path
                      d="M120,50 C110,70 110,100 120,120"
                      fill="none"
                      stroke={shirtColor === '#FFFFFF' ? '#EFEFEF' : shirtColor === '#000000' ? '#222222' : shirtColor}
                      strokeWidth="1"
                      strokeDasharray="1,10"
                      opacity="0.3"
                    />
                  </svg>

                  {/* Image overlay */}
                  {previewImage && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex justify-center items-center hover:scale-105 transition-transform duration-300">
                      <img
                        src={previewImage}
                        alt="Custom design"
                        className="max-w-full max-h-full object-contain filter drop-shadow"
                      />
                    </div>
                  )}

                  {/* Text overlay */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-4/5 flex flex-col gap-2 hover:translate-y-1 transition-transform duration-300">
                  {formValues.shirtText.split('\n').slice(0, 3).map((line: string, idx: number) => (
                      <div key={idx} className="text-base font-semibold leading-tight break-words" style={{ color: shirtColor === '#FFFFFF' ? theme.text : shirtColor === '#000000' ? '#FFFFFF' : '#000000' }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div
              className="p-6 rounded-xl border shadow hover:translate-y-1 transition-transform duration-300"
              style={{
                backgroundColor: theme.secondary,
                borderColor: theme.primary,
                boxShadow: `0 4px 10px ${theme.primary}11`
              }}
            >
              <h3 className="mb-4 text-lg relative pb-2" style={{ color: theme.text }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:rounded-full"
                  >
                    T-Shirt Color
                  </span>
                </div>
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer border-2 shadow hover:scale-110 hover:rotate-3 transition-all duration-300`}
                    style={{
                      backgroundColor: color,
                      borderColor: shirtColor === color ? theme.primary : theme.secondary,
                      transform: shirtColor === color ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: shirtColor === color ? `0 0 0 2px ${theme.primary}44` : ''
                    }}
                    onClick={() => setShirtColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col gap-6 transform translate-x-12 opacity-0 animate-slide-left">
            {/* Body Measurements */}
            <div
              className="p-6 rounded-xl border shadow hover:translate-y-1 transition-transform duration-300"
              style={{
                backgroundColor: theme.secondary,
                borderColor: theme.primary,
                boxShadow: `0 4px 10px ${theme.primary}11`
              }}
            >
              <h3 className="mb-4 text-lg relative pb-2" style={{ color: theme.text }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:rounded-full"
                  >
                    Body Measurements
                  </span>
                </div>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="height" className="mb-2 text-sm font-medium" style={{ color: theme.text }}>
                    Height (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="120"
                      max="220"
                      value={formValues.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="w-full p-3 pl-10 rounded-lg border text-base transition-all duration-300 shadow-sm focus:outline-none focus:ring"
                      style={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.primary,
                        boxShadow: `0 0 0 1px ${theme.primary}22`
                      }}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm opacity-70" style={{ color: theme.primary }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 v15 M19 v15 M12 5 v2 M12 19 v-2 M9 8 h6 M9 16 h6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="weight" className="mb-2 text-sm font-medium" style={{ color: theme.text }}>
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={formValues.weight}
                      onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                      className="w-full p-3 pl-10 rounded-lg border text-base transition-all duration-300 shadow-sm focus:outline-none focus:ring"
                      style={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.primary,
                        boxShadow: `0 0 0 1px ${theme.primary}22`
                      }}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm opacity-70" style={{ color: theme.primary }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="build" className="mb-2 text-sm font-medium" style={{ color: theme.text }}>
                  Build
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {buildOptions.map(option => (
                    <button
                      key={option}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300`}
                      style={{
                        backgroundColor: formValues.build === option ? theme.primary : theme.background,
                        color: formValues.build === option ? theme.background : theme.text,
                        border: `1px solid ${formValues.build === option ? theme.primary : theme.primary + '44'}`,
                      }}
                      onClick={() => handleInputChange('build', option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div
              className={`p-6 rounded-xl border shadow hover:translate-y-1 transition-transform duration-300`}
              style={{
                backgroundColor: dragActive ? '#f0fdf4' : theme.secondary,
                borderColor: dragActive ? '#4ade80' : theme.primary,
                boxShadow: dragActive ? '0 4px 12px #4ade8044' : `0 4px 10px ${theme.primary}11`
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <h3 className="mb-4 text-lg relative pb-2" style={{ color: theme.text }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:rounded-full"
                  >
                    Upload Design
                  </span>
                </div>
              </h3>
              <div
                className={`min-h-[150px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-300`}
                style={{
                  borderColor: dragActive ? '#4ade80' : theme.primary,
                  backgroundColor: dragActive ? '#f0fdf4' : theme.background
                }}
              >
                {previewImage ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full">
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Design preview"
                        className="max-w-full max-h-[120px] object-contain rounded-lg shadow border hover:scale-105 transition-transform duration-300"
                        style={{ borderColor: theme.primary }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <button
                          className="p-2 rounded-full cursor-pointer text-sm border-none font-medium transition-all duration-300 bg-white text-red-500"
                          onClick={() => setPreviewImage(null)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 text-center text-sm" style={{ color: theme.text }}>
                      <div className="font-medium">Design uploaded successfully!</div>
                      <div className="text-xs opacity-70 mt-1">Click on the image to remove</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-3 p-8" style={{ color: theme.text }}>
                    <div className="text-4xl opacity-50">
                      {dragActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <p className="font-medium">
                      {dragActive ? 'Drop your image here!' : 'Drop an image here or click to upload'}
                    </p>
                    <p className="text-xs opacity-70">
                      Supports JPG, PNG, GIF (max 10MB)
                    </p>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="py-3 px-6 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 shadow hover:translate-y-1 hover:shadow-md flex items-center gap-2"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
                        color: theme.background
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div
              className="p-6 rounded-xl border shadow hover:translate-y-1 transition-transform duration-300"
              style={{
                backgroundColor: theme.secondary,
                borderColor: theme.primary,
                boxShadow: `0 4px 10px ${theme.primary}11`
              }}
            >
              <h3 className="mb-4 text-lg relative pb-2" style={{ color: theme.text }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:rounded-full"
                  >
                    Custom Text
                  </span>
                </div>
              </h3>

              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Enter text to print on shirt..."
                  maxLength={100}
                  value={formValues.shirtText}
                  onChange={(e) => handleInputChange('shirtText', e.target.value)}
                  className="w-full p-3 pr-16 rounded-lg border text-base resize-none min-h-[100px] transition-all duration-300 shadow-sm focus:outline-none focus:ring"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.primary,
                    boxShadow: `0 0 0 1px ${theme.primary}22`
                  }}
                />
                <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: theme.primary + '22',
                    color: theme.primary
                  }}>
                  {formValues.shirtText.length}/100
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 text-xs">
                <div style={{ color: theme.text + '99' }}>
                  Lines: {Math.min(formValues.shirtText.split('\n').length, 3)}/3
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded text-xs transition-all duration-300"
                    style={{
                      backgroundColor: theme.primary + '22',
                      color: theme.primary
                    }}
                    onClick={() => handleInputChange('shirtText', formValues.shirtText.toUpperCase())}
                  >
                    UPPERCASE
                  </button>
                  <button
                    className="px-3 py-1 rounded text-xs transition-all duration-300"
                    style={{
                      backgroundColor: theme.primary + '22',
                      color: theme.primary
                    }}
                    onClick={() => handleInputChange('shirtText', '')}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
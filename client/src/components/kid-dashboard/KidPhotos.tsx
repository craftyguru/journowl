import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Lightbulb } from "lucide-react";

interface KidPhotosProps {
  uploadedPhotos: string[];
  onPhotoUpload: () => void;
  onAnalyzePhotos: () => void;
  photoInputRef: React.RefObject<HTMLInputElement>;
}

export function KidPhotos({
  uploadedPhotos,
  onPhotoUpload,
  onAnalyzePhotos,
  photoInputRef,
}: KidPhotosProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-4"
        >
          📸
        </motion.div>
        <h3 className="text-3xl font-bold text-pink-800 mb-2">Photo Story Magic!</h3>
        <p className="text-pink-600 text-lg mb-6">Turn your pictures into amazing stories!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 rounded-3xl border-4 border-pink-400 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-2 right-2 text-2xl"
          >
            ✨
          </motion.div>
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎨
            </motion.div>
            <h4 className="text-xl font-bold text-pink-800 mb-3">Upload Your Photos</h4>
            <p className="text-pink-600 mb-4">Add pictures from your adventures!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onPhotoUpload}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                📱 Upload Photos!
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-200 via-cyan-200 to-blue-200 p-6 rounded-3xl border-4 border-green-400 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-2 right-2 text-2xl"
          >
            🤖
          </motion.div>
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
            <h4 className="text-xl font-bold text-green-800 mb-3">AI Photo Detective</h4>
            <p className="text-green-600 mb-4">Let AI tell you what's in your photos!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onAnalyzePhotos}
                disabled={uploadedPhotos.length === 0}
                className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:from-green-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl disabled:opacity-50"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                🕵️ Analyze Photos!
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-yellow-200 to-orange-200 p-4 rounded-2xl border-3 border-yellow-400 cursor-pointer shadow-lg text-center"
        >
          <div className="text-4xl mb-2">🌈</div>
          <p className="font-bold text-yellow-800 text-sm">Add Filters</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-purple-200 to-pink-200 p-4 rounded-2xl border-3 border-purple-400 cursor-pointer shadow-lg text-center"
        >
          <div className="text-4xl mb-2">🎭</div>
          <p className="font-bold text-purple-800 text-sm">Add Stickers</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-blue-200 to-cyan-200 p-4 rounded-2xl border-3 border-blue-400 cursor-pointer shadow-lg text-center"
        >
          <div className="text-4xl mb-2">✏️</div>
          <p className="font-bold text-blue-800 text-sm">Draw on Photos</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-green-200 to-emerald-200 p-4 rounded-2xl border-3 border-green-400 cursor-pointer shadow-lg text-center"
        >
          <div className="text-4xl mb-2">📝</div>
          <p className="font-bold text-green-800 text-sm">Add Text</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border-4 border-rainbow shadow-2xl"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🎪
          </motion.div>
          <h4 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Photo Collection
          </h4>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            🖼️
          </motion.div>
        </div>
        
        {uploadedPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="relative group rounded-2xl overflow-hidden border-4 border-pink-300 shadow-lg cursor-pointer"
              >
                <img 
                  src={photo} 
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-white font-bold text-sm">✨ Click to Edit ✨</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-center py-12"
          >
            <div className="text-8xl mb-4">📷</div>
            <h5 className="text-xl font-bold text-gray-600 mb-2">No photos yet!</h5>
            <p className="text-gray-500 mb-6">Upload your first photo to start the magic!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-rainbow to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl">
                <Camera className="w-5 h-5 mr-2" />
                🌟 Add Your First Photo!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

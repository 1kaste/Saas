import React, { useState, useEffect } from 'react';

import { supabase, supabaseInitializationError } from './services/supabaseClient';
import { ShopData, Product } from './types';
import { CATEGORIES } from './constants';
import { generateProductInsight as generateInsight } from './services/geminiService';
import Spinner from './components/Spinner';
import Icon from './components/Icon';

// --- Mock useRouter for standalone preview ---
const useRouter = () => {
  const [query] = useState({ shop: 'tech-gadget-hub' });
  return {
    query,
    isFallback: false,
    pathname: '/[shop]',
  };
};
// --- End Mock useRouter ---

const App = () => {
  const router = useRouter();
  const { shop } = router.query;

  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedInsights, setGeneratedInsights] = useState<Record<number, string>>({});
  const [insightLoading, setInsightLoading] = useState<Record<number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (supabaseInitializationError) {
      setError(supabaseInitializationError);
      setLoading(false);
      return;
    }

    if (shop) {
      const fetchShopData = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!supabase) {
            throw new Error("Supabase client is not available.");
          }
          // 1. Fetch shop details from Supabase
          const { data: shopInfo, error: shopError } = await supabase
            .from('shops')
            .select('id, name, description, logo_url')
            .eq('slug', shop)
            .single();

          if (shopError) throw shopError;
          if (!shopInfo) throw new Error('Shop not found. Check if the slug in the URL is correct and the data exists in your Supabase table.');

          setShopData({
            name: shopInfo.name,
            description: shopInfo.description,
            logoUrl: shopInfo.logo_url
          });

          // 2. Fetch products for that shop
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id, title, price, description, image_url')
            .eq('shop_id', shopInfo.id);

          if (productError) throw productError;

          const formattedProducts: Product[] = (productData || []).map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            imageUrl: product.image_url,
          }));

          setProducts(formattedProducts);

        } catch (err: any) {
          setError(err.message || 'Failed to load shop data. Please check console for details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchShopData();
    }
  }, [shop]);

  const generateProductInsight = async (productId: number, productTitle: string, productDescription: string) => {
    setInsightLoading(prev => ({ ...prev, [productId]: true }));
    setGeneratedInsights(prev => ({ ...prev, [productId]: '' }));

    try {
      const insightText = await generateInsight(productTitle, productDescription);
      setGeneratedInsights(prev => ({ ...prev, [productId]: insightText }));
    } catch (err) {
      setGeneratedInsights(prev => ({ ...prev, [productId]: 'Failed to generate insight.' }));
      console.error('Error calling insight generation service:', err);
    } finally {
      setInsightLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const heroBackgroundImage = 'https://images.unsplash.com/photo-1596200236453-e83713028205?q=80&w=2940&auto=format&fit=crop';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-2xl font-bold text-gray-700 animate-pulse">Loading the latest tech...</div>
      </div>
    );
  }

  if (error) {
    const isSetupError = error.includes("Supabase URL and anonymous key are required");
    const ErrorIcon = isSetupError ? <Icon name="plugs" weight="duotone" /> : <Icon name="warning-circle" weight="duotone" />;
    const errorTitle = isSetupError ? "Configuration Required" : "An Error Occurred";
    const errorBg = isSetupError ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-700";
    const iconColor = isSetupError ? "text-amber-500" : "text-red-500";
    const subtext = isSetupError 
      ? "This is a one-time setup. The app will function correctly once the secrets are configured in your environment."
      : "Please ensure your Supabase connection details are correct and the database tables are set up.";

    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 rounded-lg ${errorBg}`}>
        <div className={`text-6xl mb-4 ${iconColor}`}>
            {ErrorIcon}
        </div>
        <h2 className="text-3xl font-bold mb-4">{errorTitle}</h2>
        <p className="text-md text-center max-w-xl leading-relaxed">{error}</p>
        <p className="text-sm mt-6 text-gray-500">{subtext}</p>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Shop not found or invalid URL.</p>
      </div>
    );
  }

  return (
    <div className={`font-sans antialiased min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800 text-gray-100 shadow-xl' : 'bg-white shadow-sm'} py-4 px-4 sm:px-6 sticky top-0 z-50`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src={shopData.logoUrl} alt={`${shopData.name} Logo`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 shadow-md" />
            <h1 className="text-xl sm:text-2xl font-bold">{shopData.name}</h1>
          </div>
          <nav className="hidden md:flex space-x-4 lg:space-x-8 text-base lg:text-lg font-medium">
            <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200`}>Home</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200`}>Smartphones</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200`}>Accessories</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200`}>Wearables</a>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200 text-xl p-1`}><Icon name="magnifying-glass" /></button>
            <button className={`relative ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-200 text-xl p-1`}>
              <Icon name="shopping-cart" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">0</span>
            </button>
            <button onClick={toggleDarkMode} className={`${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'} rounded-full p-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
              {isDarkMode ? <Icon name="sun" weight="fill" className="text-xl" /> : <Icon name="moon" weight="fill" className="text-xl" />}
            </button>
            <button onClick={toggleMobileMenu} className="md:hidden text-xl p-1"><Icon name="list" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}/></button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} fixed inset-0 z-40 md:hidden flex flex-col items-center pt-20 transition-transform duration-300 ease-in-out transform`}>
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-3xl"><Icon name="x" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}/></button>
          <nav className="flex flex-col space-y-6 text-2xl font-medium text-center">
            <a href="#" className={`${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`} onClick={toggleMobileMenu}>Home</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`} onClick={toggleMobileMenu}>Smartphones</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`} onClick={toggleMobileMenu}>Accessories</a>
            <a href="#" className={`${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`} onClick={toggleMobileMenu}>Wearables</a>
          </nav>
        </div>
      )}

      <main>
        <section className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white py-16 sm:py-20 px-4 sm:px-6 overflow-hidden`}>
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url("${heroBackgroundImage}")` }}></div>
          <div className="container mx-auto relative z-10 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight drop-shadow-lg">Unleash the Power of Connectivity</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">Explore the latest smartphones, cutting-edge accessories, and smart wearables.</p>
            <button className={`${isDarkMode ? 'bg-gray-200 text-blue-700 hover:bg-gray-300' : 'bg-white text-blue-700 hover:bg-gray-100'} px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition duration-300 shadow-lg transform hover:scale-105`}>Shop Latest Devices</button>
          </div>
        </section>

        <section className="container mx-auto py-12 sm:py-16 px-4 sm:px-6">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Browse By Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {CATEGORIES.map((category) => (
              <div key={category.name} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-lg p-5 sm:p-6 text-center transform hover:scale-105 transition-transform duration-300 border`}>
                <div className={`text-5xl sm:text-6xl mb-3 sm:mb-4 inline-block ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{category.icon}</div>
                <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{category.name}</h3>
                <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-2 hover:underline cursor-pointer text-sm sm:text-base`}>View All</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto py-12 sm:py-16 px-4 sm:px-6">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Top Picks & New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div key={product.id} className={`${isDarkMode ? 'bg-gray-800 shadow-xl hover:shadow-2xl border-gray-700' : 'bg-white shadow-xl hover:shadow-2xl border-gray-100'} rounded-xl transition-shadow duration-300 overflow-hidden group border flex flex-col`}>
                <div className="relative overflow-hidden">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300 transform translate-y-4 group-hover:translate-y-0">Quick View</button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{product.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-3 flex-grow`}>{product.description}</p>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Ksh {(product.price / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <button className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-300">Add to Cart</button>
                  </div>
                  <div className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
                    <button onClick={() => generateProductInsight(product.id, product.title, product.description)} className={`${isDarkMode ? 'bg-purple-700 text-purple-200 hover:bg-purple-600' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} py-2 px-3 rounded-full transition duration-300 shadow-sm text-xs sm:text-sm w-full font-medium flex items-center justify-center space-x-2`} disabled={insightLoading[product.id]}>
                      {insightLoading[product.id] ? <Spinner className="text-purple-500"/> : <><Icon name="sparkle" weight='fill' className="mr-1"/><span>Tech Insight</span></>}
                    </button>
                    {generatedInsights[product.id] && (
                      <p className={`mt-3 text-xs sm:text-sm ${isDarkMode ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-700 bg-purple-50 border-purple-200'} p-3 rounded-lg border leading-relaxed animate-fade-in`}>
                        {generatedInsights[product.id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gradient-to-br from-teal-500 to-green-600 text-white'} py-12 sm:py-16 px-4 sm:px-6 my-10 sm:my-16`}>
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 drop-shadow-md">Stay Connected for Tech Updates!</h2>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">Sign up for our newsletter to get the latest on new devices, exclusive deals, and tech news.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <input type="email" placeholder="Enter your email address" className="w-full sm:w-80 p-3 rounded-full text-gray-800 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition duration-300 shadow-inner" />
              <button className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-teal-700 hover:bg-gray-100'} px-6 py-2.5 rounded-full font-semibold transition duration-300 shadow-md transform hover:scale-105`}>Subscribe Now</button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className={`${isDarkMode ? 'bg-gray-950 text-gray-400' : 'bg-gray-900 text-gray-300'} py-8 sm:py-12 px-4 sm:px-6`}>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Tech Gadget Hub</h3>
            <p className="text-sm">Your ultimate source for cutting-edge smartphones, accessories, and wearables.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Shop All</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Support</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Warranty & Returns</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Connect With Us</h3>
            <div className="flex space-x-3 sm:space-x-4 text-xl">
              <a href="#" className="hover:text-blue-400 transition"><Icon name="facebook-logo"/></a>
              <a href="#" className="hover:text-blue-400 transition"><Icon name="instagram-logo"/></a>
              <a href="#" className="hover:text-blue-400 transition"><Icon name="twitter-logo"/></a>
              <a href="#" className="hover:text-blue-400 transition"><Icon name="linkedin-logo"/></a>
            </div>
            <p className="mt-4 text-xs sm:text-sm">&copy; {new Date().getFullYear()} Tech Gadget Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

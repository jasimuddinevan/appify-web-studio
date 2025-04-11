
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, Smartphone, Upload, Palette, Layout, Globe, Zap, Download } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [webUrl, setWebUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // App customization options
  const [appName, setAppName] = useState("My Web App");
  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [appIconPreview, setAppIconPreview] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [splashScreen, setSplashScreen] = useState<File | null>(null);
  const [splashScreenPreview, setSplashScreenPreview] = useState("");
  const [navigationStyle, setNavigationStyle] = useState("default");
  const [offlineSupport, setOfflineSupport] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState("portrait");
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [cacheLevel, setCacheLevel] = useState(50);

  useEffect(() => {
    // Retrieve the URL from localStorage
    const savedUrl = localStorage.getItem("webUrl");
    if (savedUrl) {
      setWebUrl(savedUrl);
    } else {
      // If no URL is found, redirect to home page
      navigate("/");
    }
  }, [navigate]);

  // Handle file uploads for app icon
  const handleAppIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAppIcon(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file uploads for splash screen
  const handleSplashScreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSplashScreen(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSplashScreenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate APK generation
  const handleGenerateApk = () => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Handle APK download
  const handleDownloadApk = () => {
    // Set downloading state
    setIsDownloading(true);
    setDownloadComplete(false);

    // Simulate file download delay
    setTimeout(() => {
      // Create a blob to simulate file download
      const dummyContent = `Web to APK conversion for: ${webUrl}\nApp name: ${appName}\nGenerated on: ${new Date().toLocaleString()}`;
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appName.replace(/\s+/g, '-').toLowerCase()}-app.apk`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update states
      setIsDownloading(false);
      setDownloadComplete(true);
      
      // Reset download complete message after 5 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left sidebar with progress indicators */}
            <div className="w-full md:w-64 lg:w-80 glass-card p-6 mb-8 md:mb-0 shrink-0">
              <h2 className="text-xl font-semibold mb-6">Build Process</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm flex items-center gap-2">
                      Website URL
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </p>
                    <p className="text-xs text-gray-500 truncate">{webUrl}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">Customization</p>
                    <p className="text-xs text-gray-500">Configure your app options</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">Build</p>
                    <p className="text-xs text-gray-500">Generate your Android app</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">Download</p>
                    <p className="text-xs text-gray-500">Get your APK file</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-semibold mb-2">Target Website</h3>
                <div className="flex items-center gap-2">
                  <Input 
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                  <Button size="sm" variant="outline">Update</Button>
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-grow w-full">
              <div className="glass-card p-6">
                <h1 className="text-2xl font-bold mb-6">Customize Your App</h1>
                
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">App Information</h3>
                      
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="appName">App Name</Label>
                          <Input 
                            id="appName"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            placeholder="My Web App"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="appIcon">App Icon</Label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                              {appIconPreview ? (
                                <img src={appIconPreview} alt="App icon preview" className="w-full h-full object-cover" />
                              ) : (
                                <Smartphone className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <Input
                                id="appIcon"
                                type="file"
                                accept="image/*"
                                onChange={handleAppIconChange}
                                className="text-sm"
                              />
                              <p className="text-xs text-gray-500 mt-1">Recommended size: 512x512 px</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="screenOrientation">Screen Orientation</Label>
                          <div className="flex gap-4">
                            <div 
                              className={`border rounded-lg p-4 flex-1 cursor-pointer ${screenOrientation === 'portrait' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setScreenOrientation('portrait')}
                            >
                              <div className="w-12 h-16 mx-auto bg-gray-200 rounded-md"></div>
                              <p className="text-center text-sm mt-2">Portrait</p>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex-1 cursor-pointer ${screenOrientation === 'landscape' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setScreenOrientation('landscape')}
                            >
                              <div className="w-16 h-12 mx-auto bg-gray-200 rounded-md"></div>
                              <p className="text-center text-sm mt-2">Landscape</p>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex-1 cursor-pointer ${screenOrientation === 'auto' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setScreenOrientation('auto')}
                            >
                              <div className="w-12 h-12 mx-auto bg-gray-200 rounded-md rotate-45"></div>
                              <p className="text-center text-sm mt-2">Auto-rotate</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Visual Customization</h3>
                      
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              id="primaryColor"
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="w-10 h-10 rounded border p-1"
                            />
                            <Input
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="splashScreen">Splash Screen</Label>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-36 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                              {splashScreenPreview ? (
                                <img src={splashScreenPreview} alt="Splash screen preview" className="w-full h-full object-cover" />
                              ) : (
                                <Upload className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <Input
                                id="splashScreen"
                                type="file"
                                accept="image/*"
                                onChange={handleSplashScreenChange}
                                className="text-sm"
                              />
                              <p className="text-xs text-gray-500 mt-1">Recommended size: 1080x1920 px</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="navigationStyle">Navigation Style</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer ${navigationStyle === 'default' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setNavigationStyle('default')}
                            >
                              <div className="h-24 bg-gray-200 rounded-md relative">
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-300 flex items-center justify-center">
                                  <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                              </div>
                              <p className="text-center text-sm mt-2">Default</p>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer ${navigationStyle === 'bottom-tabs' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setNavigationStyle('bottom-tabs')}
                            >
                              <div className="h-24 bg-gray-200 rounded-md relative">
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-300 flex items-center justify-around">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                              </div>
                              <p className="text-center text-sm mt-2">Bottom Tabs</p>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer ${navigationStyle === 'side-drawer' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                              onClick={() => setNavigationStyle('side-drawer')}
                            >
                              <div className="h-24 bg-gray-200 rounded-md relative">
                                <div className="absolute top-0 left-0 bottom-0 w-4 bg-gray-300 flex flex-col items-center justify-around py-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                              </div>
                              <p className="text-center text-sm mt-2">Side Drawer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">App Features</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="offlineSupport">Offline Support</Label>
                            <p className="text-sm text-gray-500">Allow your app to work without internet</p>
                          </div>
                          <Switch
                            id="offlineSupport"
                            checked={offlineSupport}
                            onCheckedChange={setOfflineSupport}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="pushNotifications">Push Notifications</Label>
                            <p className="text-sm text-gray-500">Send notifications to your users</p>
                          </div>
                          <Switch
                            id="pushNotifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="zoomEnabled">Zoom Enabled</Label>
                            <p className="text-sm text-gray-500">Allow users to zoom in/out</p>
                          </div>
                          <Switch
                            id="zoomEnabled"
                            checked={zoomEnabled}
                            onCheckedChange={setZoomEnabled}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Advanced Settings</h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cacheLevel">Cache Level: {cacheLevel}%</Label>
                          </div>
                          <Slider
                            id="cacheLevel"
                            min={0}
                            max={100}
                            step={10}
                            value={[cacheLevel]}
                            onValueChange={(vals) => setCacheLevel(vals[0])}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Minimal</span>
                            <span>Maximum</span>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            Export Configuration
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="btn-gradient flex-1 flex gap-2 items-center justify-center" 
                  disabled={isLoading}
                  onClick={handleGenerateApk}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating APK ({progress}%)
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate APK
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 flex gap-2 items-center justify-center" 
                  disabled={isLoading || progress < 100 || isDownloading}
                  onClick={handleDownloadApk}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download APK
                    </>
                  )}
                </Button>
              </div>
              
              {isLoading && (
                <div className="mt-6 glass-card p-4">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300" 
                      style={{width: `${progress}%`}}
                    />
                  </div>
                  <p className="text-center text-sm mt-2">Building your Android app... {progress}% complete</p>
                  {progress === 100 && (
                    <div className="flex justify-center mt-4">
                      <img 
                        src="/lovable-uploads/a16f60a1-65a0-4bf5-b8f0-c7124ac41002.png" 
                        alt="WebToAPK Builder" 
                        className="max-w-full h-auto max-h-40 rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {downloadComplete && (
                <div className="mt-6 glass-card p-4 bg-green-50 border border-green-100">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium">APK downloaded successfully!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

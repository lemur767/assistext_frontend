import { useState, useEffect } from 'react';
import { 
  User, 
  Brain, 
  Clock, 
  MessageSquare, 
  Settings, 
  Phone, 
  Globe,
  Save,
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Type,
  Sliders,
  BookOpen,
  RotateCcw,
  Copy,
  Upload,
  Download
} from 'lucide-react';


const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState({
    id: 1,
    name: "Sarah Wilson",
    phone_number: "+1 (555) 123-4567",
    description: "Professional companion available for dinner dates and social events.",
    timezone: "America/New_York",
    is_active: true,
    ai_enabled: true,
    daily_auto_response_limit: 100,
    business_hours: {
      monday: { start: "10:00", end: "22:00" },
      tuesday: { start: "10:00", end: "22:00" },
      wednesday: { start: "10:00", end: "22:00" },
      thursday: { start: "10:00", end: "22:00" },
      friday: { start: "10:00", end: "22:00" },
      saturday: { start: "12:00", end: "22:00" },
      sunday: { start: "12:00", end: "22:00" }
    }
  });

  const [aiSettings, setAiSettings] = useState({
    model_version: "dolphin-mistral:7b-v2.8",
    temperature: 0.7,
    response_length: 150,
    custom_instructions: "Be friendly and professional. Keep responses brief and natural. Never discuss explicit services or prices.",
    style_notes: "Use casual language with some emojis. Be warm but maintain boundaries."
  });

  const [autoReplies, setAutoReplies] = useState([
    { id: 1, keyword: "rates", response: "Thanks for your interest! I'd prefer to discuss details privately. Could you tell me more about what you're looking for?" },
    { id: 2, keyword: "available", response: "Let me check my schedule and get back to you shortly!" }
  ]);

  const [textExamples, setTextExamples] = useState([
    { id: 1, content: "Hey! How's your day going? 😊", is_incoming: false },
    { id: 2, content: "Thanks for reaching out! I'll get back to you soon", is_incoming: false },
    { id: 3, content: "That sounds lovely! Let me check my availability", is_incoming: false }
  ]);

  const [outOfOfficeMessage, setOutOfOfficeMessage] = useState("Thanks for your message! I'm currently unavailable but will respond as soon as possible. Have a great day! 💕");

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Toronto', 'America/Vancouver', 'Europe/London', 'Europe/Paris'
  ];

  const handleBusinessHoursChange = (day, field, value) => {
    setProfile(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value
        }
      }
    }));
  };

  const addAutoReply = () => {
    const newReply = {
      id: Date.now(),
      keyword: "",
      response: ""
    };
    setAutoReplies([...autoReplies, newReply]);
  };

  const updateAutoReply = (id, field, value) => {
    setAutoReplies(autoReplies.map(reply => 
      reply.id === id ? { ...reply, [field]: value } : reply
    ));
  };

  const deleteAutoReply = (id) => {
    setAutoReplies(autoReplies.filter(reply => reply.id !== id));
  };

  const addTextExample = () => {
    const newExample = {
      id: Date.now(),
      content: "",
      is_incoming: false
    };
    setTextExamples([...textExamples, newExample]);
  };

  const updateTextExample = (id, field, value) => {
    setTextExamples(textExamples.map(example => 
      example.id === id ? { ...example, [field]: value } : example
    ));
  };

  const deleteTextExample = (id) => {
    setTextExamples(textExamples.filter(example => example.id !== id));
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500">{profile.phone_number}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`h-2 w-2 rounded-full ${profile.is_active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {profile.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {profile.ai_enabled && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">AI Enabled</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                <Copy className="h-4 w-4 inline mr-2" />
                Duplicate Profile
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <TabButton id="basic" label="Basic Info" icon={User} />
            <TabButton id="ai" label="AI Settings" icon={Brain} />
            <TabButton id="hours" label="Business Hours" icon={Clock} />
            <TabButton id="replies" label="Auto Replies" icon={MessageSquare} />
            <TabButton id="examples" label="Text Examples" icon={BookOpen} />
            <TabButton id="advanced" label="Advanced" icon={Settings} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({...profile, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily AI Response Limit</label>
                  <input
                    type="number"
                    value={profile.daily_auto_response_limit}
                    onChange={(e) => setProfile({...profile, daily_auto_response_limit: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.is_active}
                      onChange={(e) => setProfile({...profile, is_active: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Profile Active</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.ai_enabled}
                      onChange={(e) => setProfile({...profile, ai_enabled: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">AI Responses Enabled</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Model Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model Version</label>
                    <select
                      value={aiSettings.model_version}
                      onChange={(e) => setAiSettings({...aiSettings, model_version: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="dolphin-mistral:7b-v2.8">Dolphin Mistral 7B v2.8</option>
                      <option value="llama2:7b">Llama 2 7B</option>
                      <option value="codellama:7b">Code Llama 7B</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature: {aiSettings.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiSettings.temperature}
                      onChange={(e) => setAiSettings({...aiSettings, temperature: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Response Length</label>
                    <input
                      type="number"
                      value={aiSettings.response_length}
                      onChange={(e) => setAiSettings({...aiSettings, response_length: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Instructions</h3>
                <textarea
                  value={aiSettings.custom_instructions}
                  onChange={(e) => setAiSettings({...aiSettings, custom_instructions: e.target.value})}
                  rows={4}
                  placeholder="Provide specific instructions for how the AI should respond..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Notes</h3>
                <textarea
                  value={aiSettings.style_notes}
                  onChange={(e) => setAiSettings({...aiSettings, style_notes: e.target.value})}
                  rows={3}
                  placeholder="Describe the writing style, tone, and personality..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Business Hours</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <RotateCcw className="h-4 w-4 inline mr-1" />
                  Reset to Default
                </button>
              </div>
              
              <div className="space-y-4">
                {days.map((day, index) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <span className="font-medium text-gray-900">{dayLabels[index]}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={profile.business_hours[day]?.start || '10:00'}
                          onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <span className="text-gray-400">to</span>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={profile.business_hours[day]?.end || '22:00'}
                          onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Out of Office Message</h3>
                <textarea
                  value={outOfOfficeMessage}
                  onChange={(e) => setOutOfOfficeMessage(e.target.value)}
                  rows={3}
                  placeholder="Message to send when outside business hours..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'replies' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Auto Replies</h2>
                <button
                  onClick={addAutoReply}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Reply</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {autoReplies.map(reply => (
                  <div key={reply.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keyword</label>
                        <input
                          type="text"
                          value={reply.keyword}
                          onChange={(e) => updateAutoReply(reply.id, 'keyword', e.target.value)}
                          placeholder="e.g., rates, available, booking"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auto Reply Message</label>
                      <textarea
                        value={reply.response}
                        onChange={(e) => updateAutoReply(reply.id, 'response', e.target.value)}
                        rows={2}
                        placeholder="Enter the automatic response..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteAutoReply(reply.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Text Examples</h2>
                  <p className="text-sm text-gray-500 mt-1">Add examples of your texting style to improve AI responses</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                  </button>
                  <button
                    onClick={addTextExample}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Example</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {textExamples.map(example => (
                  <div key={example.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4 mb-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`example-${example.id}`}
                          checked={!example.is_incoming}
                          onChange={() => updateTextExample(example.id, 'is_incoming', false)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">My Message</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`example-${example.id}`}
                          checked={example.is_incoming}
                          onChange={() => updateTextExample(example.id, 'is_incoming', true)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Client Message</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <textarea
                        value={example.content}
                        onChange={(e) => updateTextExample(example.id, 'content', e.target.value)}
                        rows={2}
                        placeholder="Enter example message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => deleteTextExample(example.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Advanced Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message Retention (days)</label>
                      <input
                        type="number"
                        defaultValue={30}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (messages/5min)</label>
                      <input
                        type="number"
                        defaultValue={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-900">Safety Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Auto-flag suspicious messages</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Block explicit content requests</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Require manual approval for new clients</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Enable debug logging</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Backup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    <span>Export Profile</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    <span>Export Messages</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    <span>Export Training Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
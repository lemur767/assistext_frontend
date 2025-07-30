interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;

}



const TabsContext = React.createContext<TabsContextType | null>(null);



interface TabsProps {

  defaultValue: string;

  value?: string;

  onValueChange?: (value: string) => void;

  children: React.ReactNode;

  className?: string;

}



export const Tabs: React.FC<TabsProps> = ({

  defaultValue,

  value,

  onValueChange,

  children,

  className = '',

}) => {

  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const activeTab = value ?? internalValue;

  

  const setActiveTab = (tab: string) => {

    if (onValueChange) {

      onValueChange(tab);

    } else {

      setInternalValue(tab);

    }

  };



  return (

    <TabsContext.Provider value={{ activeTab, setActiveTab }}>

      <div className={`space-y-4 ${className}`}>

        {children}

      </div>

    </TabsContext.Provider>

  );

};



interface TabsListProps {

  children: React.ReactNode;

  className?: string;

}



export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {

  return (

    <div className={`flex space-x-1 border-b border-brand ${className}`}>

      {children}

    </div>

  );

};



interface TabsTriggerProps {

  value: string;

  children: React.ReactNode;

  className?: string;

}



export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {

  const context = React.useContext(TabsContext);

  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  

  const { activeTab, setActiveTab } = context;

  const isActive = activeTab === value;



  return (

    <button

      onClick={() => setActiveTab(value)}

      className={`

        px-4 py-2 text-sm font-medium border-b-2 transition-colors

        ${isActive 

          ? 'border-brand-primary text-primary' 

          : 'border-transparent text-muted hover:text-brand hover:border-gray-300'

        }

        ${className}

      `}

    >

      {children}

    </button>

  );

};



interface TabsContentProps {

  value: string;

  children: React.ReactNode;

  className?: string;

}



export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {

  const context = React.useContext(TabsContext);

  if (!context) throw new Error('TabsContent must be used within Tabs');

  

  const { activeTab } = context;

  

  if (activeTab !== value) return null;



  return (

    <div className={`pt-4 ${className}`}>

      {children}

    </div>

  );

};




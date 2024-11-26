import React from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (value: string) => void;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, className = '', children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const activeTab = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    if (child.type === TabsList || child.type === TabsTrigger || child.type === TabsContent) {
      return React.cloneElement(child, {
        activeTab,
        onClick: handleValueChange
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
}

export function TabsList({ className = '', children, activeTab, onClick }: TabsListProps & { activeTab?: string; onClick?: (value: string) => void }) {
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    if (child.type === TabsTrigger) {
      return React.cloneElement(child, {
        activeTab,
        onClick
      });
    }
    return child;
  });

  return (
    <div className={`flex space-x-4 border-b border-gray-200 ${className}`}>
      {childrenWithProps}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '', activeTab, onClick }: TabsTriggerProps & { activeTab?: string }) {
  const isActive = activeTab === value;
  
  const handleClick = () => {
    onClick?.(value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        isActive
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-500 hover:text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab }: TabsContentProps & { activeTab?: string }) {
  if (value !== activeTab) return null;
  return <div>{children}</div>;
}
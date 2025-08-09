export const Dialog = ({children}:any) => <>{children}</>;
export const DialogContent = ({children}:any) => <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'><div className='bg-white rounded-lg p-6 max-w-lg w-full'>{children}</div></div>;
export const DialogTrigger = ({children, ...props}:any) => <button {...props}>{children}</button>;
export const DialogHeader = ({children}:any) => <div className='mb-4'>{children}</div>;
export const DialogTitle = ({children}:any) => <h2 className='text-lg font-semibold'>{children}</h2>;
export const DialogDescription = ({children}:any) => <p className='text-sm text-gray-600'>{children}</p>;
export const VisuallyHidden = ({children}:any) => <span className='sr-only'>{children}</span>;

export interface Feature {
    title: string;
    description: string;
    image: string;
    className?: string;
}

export interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: string;
} 
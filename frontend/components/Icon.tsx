import { icons } from "lucide-react";

const Icon = ({
    name,
    color,
    size,
    className,
}: {
    name: keyof typeof icons;
    color?: string;
    size?: string;
    className?: string;
}) => {
    const LucideIcon = icons[name];

    return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;

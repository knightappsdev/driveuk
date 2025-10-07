import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditableFieldProps } from './types';

export default function EditableField({
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  placeholder
}: EditableFieldProps) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <p className="text-gray-900">{value || 'Not provided'}</p>
    </div>
  );
}
import { CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <CardContent className="flex items-center justify-center h-full">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Select a conversation
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    </CardContent>
  );
}
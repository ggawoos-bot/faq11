
import React, { useState, useMemo } from 'react';
import { FAQ, Category } from '../types';
import { SearchIcon, ChevronDownIcon, ThumbUpIcon, ThumbDownIcon, EyeIcon } from '../components/icons';

interface AccordionItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  onFeedback: (id: string, type: 'helpful' | 'notHelpful') => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq, isOpen, onToggle, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  const handleFeedbackClick = (type: 'helpful' | 'notHelpful') => {
    if (!feedbackGiven) {
      onFeedback(faq.id, type);
      setFeedbackGiven(true);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <h2>
        <button
          type="button"
          className="flex justify-between items-center w-full p-5 font-medium text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={onToggle}
        >
          <span className="flex-1 text-base">{faq.question}</span>
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <EyeIcon className="w-5 h-5 mr-1" />
            <span>{faq.views}</span>
          </div>
          <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      {isOpen && (
        <div className="p-5 border-t border-gray-200 bg-white">
          <p className="mb-4 text-gray-600 leading-relaxed">{faq.answer}</p>
          <div className="flex items-center justify-end space-x-4">
            <span className="text-sm text-gray-500">이 답변이 도움이 되었나요?</span>
            <button 
              onClick={() => handleFeedbackClick('helpful')}
              disabled={feedbackGiven}
              className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbUpIcon className="w-4 h-4 mr-1 text-green-500" />
              도움이 됐어요 ({faq.helpful})
            </button>
            <button 
              onClick={() => handleFeedbackClick('notHelpful')}
              disabled={feedbackGiven}
              className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbDownIcon className="w-4 h-4 mr-1 text-red-500" />
              도움이 안됐어요 ({faq.notHelpful})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface UserPageProps {
  faqs: FAQ[];
  onIncrementView: (id: string) => void;
  onFeedback: (id: string, type: 'helpful' | 'notHelpful') => void;
}

const UserPage: React.FC<UserPageProps> = ({ faqs, onIncrementView, onFeedback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  
  const categories: ('all' | Category)[] = ['all', ...Object.values(Category)];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = searchTerm.trim() === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, searchTerm, selectedCategory]);

  const handleToggle = (id: string) => {
    if (openId !== id) {
        onIncrementView(id);
        setOpenId(id);
    } else {
        setOpenId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="궁금한 점을 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
          >
            {cat === 'all' ? '전체' : cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => (
            <AccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
              onFeedback={onFeedback}
            />
          ))
        ) : (
          <p className="p-10 text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;

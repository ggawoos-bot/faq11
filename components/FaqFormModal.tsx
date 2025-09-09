
import React, { useState, useEffect } from 'react';
import { FAQ, Category } from '../types';
import { XMarkIcon } from './icons';

interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id' | 'views' | 'helpful' | 'notHelpful' | 'createdAt' | 'updatedAt'>) => void;
  faq: FAQ | null;
}

const FaqFormModal: React.FC<FaqFormModalProps> = ({ isOpen, onClose, onSave, faq }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<Category>(Category.GENERAL);

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory(Category.GENERAL);
    }
  }, [faq, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSave({ question, answer, category });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-5">
            <h3 className="text-xl font-semibold text-gray-900">{faq ? 'FAQ 수정' : '새 FAQ 등록'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5">
              <XMarkIcon className="w-5 h-5"/>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="question" className="block mb-2 text-sm font-medium text-gray-900">질문</label>
                <input
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">카테고리</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="answer" className="block mb-2 text-sm font-medium text-gray-900">답변</label>
                <textarea
                  id="answer"
                  rows={8}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="답변 내용을 입력하세요..."
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end items-center border-t pt-4 mt-5 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
              >
                취소
              </button>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaqFormModal;

import React, { useState, useMemo } from 'react';
import { FAQ, Category } from '../types';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from '../components/icons';
import FaqFormModal from '../components/FaqFormModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminPageProps {
  faqs: FAQ[];
  onAdd: (faq: Omit<FAQ, 'id' | 'views' | 'helpful' | 'notHelpful' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ faqs, onAdd, onUpdate, onDelete }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const handleAddNew = () => {
    setEditingFaq(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingFaqId(id);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (deletingFaqId) {
      onDelete(deletingFaqId);
    }
    setIsConfirmModalOpen(false);
    setDeletingFaqId(null);
  };
  
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
      const matchesSearch = searchTerm.trim() === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, searchTerm, filterCategory]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">FAQ 관리</h2>
        <button
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          새 FAQ 등록
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="질문으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">모든 카테고리</option>
                {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">질문</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">피드백 (도움됨/안됨)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정일</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFaqs.map(faq => (
              <tr key={faq.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-sm">{faq.question}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {faq.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.views}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-green-600">{faq.helpful}</span> / <span className="text-red-600">{faq.notHelpful}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.updatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(faq)} className="text-indigo-600 hover:text-indigo-900 mr-4"><PencilIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteClick(faq.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isFormModalOpen && (
        <FaqFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={(faqData) => {
            if (editingFaq) {
              onUpdate({ ...editingFaq, ...faqData });
            } else {
              onAdd(faqData);
            }
          }}
          faq={editingFaq}
        />
      )}
      
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="FAQ 삭제"
          message="정말로 이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
      )}
    </div>
  );
};

export default AdminPage;

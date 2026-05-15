import { Trash2, Edit2, Check, X } from 'lucide-react'

const TransactionItem = ({ 
  transaction, 
  isEditing, 
  editForm, 
  setEditForm, 
  onSave, 
  onCancel, 
  onDelete, 
  type, 
  categoryIcons, 
  setEditingId 
}) => {
  const { id, description, amount, category, date } = transaction

  if (isEditing) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-3 p-4 bg-white rounded-xl border border-teal-200 shadow-sm transition-all">
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="Description"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Amount"
            />
            <input
              type="date"
              value={editForm.date?.split('T')[0]}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={onSave} className="flex-1 md:flex-none p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            <Check size={20} className="mx-auto" />
          </button>
          <button onClick={onCancel} className="flex-1 md:flex-none p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
            <X size={20} className="mx-auto" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${type === 'income' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
          {categoryIcons[category] || categoryIcons['Other']}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{description}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">{category}</span>
            <span>•</span>
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-black text-lg ${type === 'income' ? 'text-teal-600' : 'text-orange-600'}`}>
            {type === 'income' ? '+ ₹' : '- ₹'}{Number(amount).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => {
              setEditingId(id)
              setEditForm({ description, amount, category, date })
            }}
            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem
// Emergency Action Checklist System

export interface ChecklistItem {
    id: string;
    item: string; // Changed from 'task' to 'item' to match usage
    priority: 'critical' | 'important' | 'standard';
    completed: boolean;
    estimated_time: number; // in minutes
    urgent?: boolean; // Added for urgent flag
}

export interface EmergencyChecklist {
    emergency_type: string;
    title: string;
    items: ChecklistItem[];
    total_estimated_time: number;
}

// Emergency Action Checklists
export function getEmergencyChecklist(taskType: string, severity: 'LOW' | 'MEDIUM' | 'HIGH'): EmergencyChecklist {
    const checklists: Record<string, Record<string, EmergencyChecklist>> = {
        'medicine': {
            'LOW': {
                emergency_type: 'medicine',
                title: 'Medicine Delivery - Low Priority',
                items: [
                    { id: '1', item: 'Confirm medication details with pharmacy', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '2', item: 'Verify elder\'s identity and address', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Check prescription expiration date', priority: 'important', completed: false, estimated_time: 2 },
                    { id: '4', item: 'Deliver medication securely', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '5', item: 'Document delivery confirmation', priority: 'standard', completed: false, estimated_time: 2 },
                ],
                total_estimated_time: 22
            },
            'MEDIUM': {
                emergency_type: 'medicine',
                title: 'Medicine Delivery - Medium Priority',
                items: [
                    { id: '1', item: 'Call pharmacy to confirm medication availability', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '2', item: 'Verify elder\'s identity and medical condition', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Check for potential drug interactions', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '4', item: 'Rush delivery - use fastest route', priority: 'critical', completed: false, estimated_time: 15 },
                    { id: '5', item: 'Call elder upon arrival', priority: 'important', completed: false, estimated_time: 2 },
                    { id: '6', item: 'Explain medication usage and side effects', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '7', item: 'Monitor elder for 5 minutes after administration', priority: 'standard', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 40
            },
            'HIGH': {
                emergency_type: 'medicine',
                title: 'Emergency Medicine Delivery - High Priority',
                items: [
                    { id: '1', item: 'EMERGENCY: Contact emergency services if needed', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '2', item: 'Verify life-saving medication requirements', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Contact pharmacy for emergency preparation', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '4', item: 'Use emergency lights/sirens if permitted', priority: 'critical', completed: false, estimated_time: 1 },
                    { id: '5', item: 'Immediate delivery - shortest route', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '6', item: 'Administer medication if trained and authorized', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '7', item: 'Monitor vital signs continuously', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '8', item: 'Stay with elder until help arrives', priority: 'critical', completed: false, estimated_time: 15 },
                    { id: '9', item: 'Document all actions and observations', priority: 'important', completed: false, estimated_time: 3 },
                ],
                total_estimated_time: 52
            }
        },
        'grocery': {
            'LOW': {
                emergency_type: 'grocery',
                title: 'Grocery Shopping - Standard Request',
                items: [
                    { id: '1', item: 'Review shopping list with elder', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '2', item: 'Check budget and payment method', priority: 'important', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Go to preferred store', priority: 'standard', completed: false, estimated_time: 15 },
                    { id: '4', item: 'Shop for items on list', priority: 'standard', completed: false, estimated_time: 30 },
                    { id: '5', item: 'Check expiration dates on perishables', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '6', item: 'Deliver groceries and help put away', priority: 'standard', completed: false, estimated_time: 10 },
                ],
                total_estimated_time: 68
            },
            'MEDIUM': {
                emergency_type: 'grocery',
                title: 'Urgent Grocery Shopping',
                items: [
                    { id: '1', item: 'Confirm essential items needed urgently', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '2', item: 'Check for dietary restrictions', priority: 'important', completed: false, estimated_time: 2 },
                    { id: '3', item: 'Go to nearest store with essentials', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '4', item: 'Prioritize essential items first', priority: 'critical', completed: false, estimated_time: 20 },
                    { id: '5', item: 'Call elder if items unavailable', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '6', item: 'Rapid delivery and unpacking', priority: 'important', completed: false, estimated_time: 10 },
                ],
                total_estimated_time: 50
            },
            'HIGH': {
                emergency_type: 'grocery',
                title: 'Emergency Grocery - Critical Need',
                items: [
                    { id: '1', item: 'EMERGENCY: Assess immediate food/water needs', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '2', item: 'Contact elder for specific urgent items', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Go to 24/7 store or pharmacy', priority: 'critical', completed: false, estimated_time: 8 },
                    { id: '4', item: 'Focus on essential supplies only', priority: 'critical', completed: false, estimated_time: 15 },
                    { id: '5', item: 'Check for medical dietary requirements', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '6', item: 'Immediate delivery and setup', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '7', item: 'Ensure elder has access to essentials', priority: 'critical', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 48
            }
        },
        'emergency': {
            'LOW': {
                emergency_type: 'emergency',
                title: 'Emergency Assistance - Low Severity',
                items: [
                    { id: '1', item: 'Contact elder to assess situation', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '2', item: 'Evaluate if emergency services needed', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '3', item: 'Provide immediate assistance if safe', priority: 'important', completed: false, estimated_time: 10 },
                    { id: '4', item: 'Contact family members', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '5', item: 'Document incident details', priority: 'standard', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 25
            },
            'MEDIUM': {
                emergency_type: 'emergency',
                title: 'Emergency Response - Medium Severity',
                items: [
                    { id: '1', item: 'EMERGENCY: Call 108/911 immediately if needed', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '2', item: 'Assess safety of the scene', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '3', item: 'Provide first aid if trained', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '4', item: 'Stay with elder until help arrives', priority: 'critical', completed: false, estimated_time: 20 },
                    { id: '5', item: 'Monitor vital signs', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '6', item: 'Contact emergency contacts', priority: 'important', completed: false, estimated_time: 3 },
                    { id: '7', item: 'Prepare information for paramedics', priority: 'important', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 47
            },
            'HIGH': {
                emergency_type: 'emergency',
                title: 'CRITICAL EMERGENCY - Life Threatening',
                items: [
                    { id: '1', item: 'IMMEDIATE: Call emergency services (108/911)', priority: 'critical', completed: false, estimated_time: 1 },
                    { id: '2', item: 'Check breathing and consciousness', priority: 'critical', completed: false, estimated_time: 1 },
                    { id: '3', item: 'Start CPR if trained and no breathing', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '4', item: 'Control bleeding if present', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '5', item: 'Maintain airway and breathing', priority: 'critical', completed: false, estimated_time: 15 },
                    { id: '6', item: 'Stay with elder continuously', priority: 'critical', completed: false, estimated_time: 20 },
                    { id: '7', item: 'Relay information to emergency services', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '8', item: 'Clear area for emergency responders', priority: 'important', completed: false, estimated_time: 2 },
                    { id: '9', item: 'Gather medications and medical history', priority: 'important', completed: false, estimated_time: 3 },
                    { id: '10', item: 'Contact family with status updates', priority: 'standard', completed: false, estimated_time: 3 },
                ],
                total_estimated_time: 55
            }
        },
        'companion': {
            'LOW': {
                emergency_type: 'companion',
                title: 'Companion Visit - Standard',
                items: [
                    { id: '1', item: 'Confirm visit time with elder', priority: 'important', completed: false, estimated_time: 2 },
                    { id: '2', item: 'Prepare conversation topics', priority: 'standard', completed: false, estimated_time: 5 },
                    { id: '3', item: 'Travel to elder\'s location', priority: 'standard', completed: false, estimated_time: 20 },
                    { id: '4', item: 'Engage in conversation and activities', priority: 'standard', completed: false, estimated_time: 60 },
                    { id: '5', item: 'Document visit notes', priority: 'standard', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 92
            },
            'MEDIUM': {
                emergency_type: 'companion',
                title: 'Urgent Companion Visit',
                items: [
                    { id: '1', item: 'Assess emotional support needs', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '2', item: 'Prepare for potential crisis intervention', priority: 'important', completed: false, estimated_time: 5 },
                    { id: '3', item: 'Immediate travel to location', priority: 'critical', completed: false, estimated_time: 15 },
                    { id: '4', item: 'Provide emotional support and listening', priority: 'critical', completed: false, estimated_time: 45 },
                    { id: '5', item: 'Assess for additional needs', priority: 'important', completed: false, estimated_time: 10 },
                    { id: '6', item: 'Contact family if concerns arise', priority: 'important', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 78
            },
            'HIGH': {
                emergency_type: 'companion',
                title: 'CRITICAL: Emotional Crisis Support',
                items: [
                    { id: '1', item: 'EMERGENCY: Assess for self-harm risk', priority: 'critical', completed: false, estimated_time: 2 },
                    { id: '2', item: 'Contact mental health crisis line if needed', priority: 'critical', completed: false, estimated_time: 3 },
                    { id: '3', item: 'Immediate presence at location', priority: 'critical', completed: false, estimated_time: 10 },
                    { id: '4', item: 'Provide de-escalation support', priority: 'critical', completed: false, estimated_time: 30 },
                    { id: '5', item: 'Monitor for safety concerns', priority: 'critical', completed: false, estimated_time: 20 },
                    { id: '6', item: 'Contact mental health professionals', priority: 'critical', completed: false, estimated_time: 5 },
                    { id: '7', item: 'Coordinate with family for support', priority: 'important', completed: false, estimated_time: 5 },
                ],
                total_estimated_time: 75
            }
        }
    };

    // Default checklist if task type not found
    const defaultChecklist: EmergencyChecklist = {
        emergency_type: 'general',
        title: 'General Assistance Request',
        items: [
            { id: '1', item: 'Contact elder to understand needs', priority: 'critical', completed: false, estimated_time: 5 },
            { id: '2', item: 'Assess situation and requirements', priority: 'important', completed: false, estimated_time: 10 },
            { id: '3', item: 'Provide appropriate assistance', priority: 'critical', completed: false, estimated_time: 30 },
            { id: '4', item: 'Document completion', priority: 'standard', completed: false, estimated_time: 5 },
        ],
        total_estimated_time: 50
    };

    // Try to find matching checklist
    const taskTypeLower = taskType.toLowerCase();
    for (const [key, value] of Object.entries(checklists)) {
        if (taskTypeLower.includes(key)) {
            return value[severity] || value['MEDIUM'];
        }
    }

    return defaultChecklist;
}

// Helper function to get priority color
export function getPriorityColor(priority: 'critical' | 'important' | 'standard'): string {
    switch (priority) {
        case 'critical': return 'text-red-600 bg-red-50 border-red-200';
        case 'important': return 'text-amber-600 bg-amber-50 border-amber-200';
        case 'standard': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
}

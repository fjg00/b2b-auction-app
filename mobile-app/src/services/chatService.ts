import { supabase } from '../lib/supabase';

export interface Message {
    id: string;
    transaction_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    sender?: {
        full_name: string;
        company_name?: string;
    };
}

export async function fetchMessages(transactionId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:users!sender_id(full_name, company_name)
        `)
        .eq('transaction_id', transactionId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function sendMessage(transactionId: string, senderId: string, content: string) {
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            transaction_id: transactionId,
            sender_id: senderId,
            content: content
        }])
        .select()
        .single();

    if (error) {
        console.error('Supabase sendMessage error:', error);
        throw error;
    }
    return data;
}

export function subscribeToMessages(transactionId: string, callback: (payload: any) => void) {
    return supabase
        .channel(`public:messages:transaction_id=eq.${transactionId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `transaction_id=eq.${transactionId}`
            },
            callback
        )
        .subscribe();
}

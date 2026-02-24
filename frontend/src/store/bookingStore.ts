import { create } from 'zustand';

interface BookingState {
    selectedPandit: any | null;
    selectedService: any | null;
    bookingDate: string;
    timeSlot: string;
    address: string;
    couponCode: string;
    setSelectedPandit: (pandit: any) => void;
    setSelectedService: (service: any) => void;
    setBookingDate: (date: string) => void;
    setTimeSlot: (slot: string) => void;
    setAddress: (address: string) => void;
    setCouponCode: (code: string) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    selectedPandit: null,
    selectedService: null,
    bookingDate: '',
    timeSlot: '',
    address: '',
    couponCode: '',
    setSelectedPandit: (pandit) => set({ selectedPandit: pandit }),
    setSelectedService: (service) => set({ selectedService: service }),
    setBookingDate: (date) => set({ bookingDate: date }),
    setTimeSlot: (slot) => set({ timeSlot: slot }),
    setAddress: (address) => set({ address }),
    setCouponCode: (code) => set({ couponCode: code }),
    resetBooking: () => set({ selectedPandit: null, selectedService: null, bookingDate: '', timeSlot: '', address: '', couponCode: '' }),
}));

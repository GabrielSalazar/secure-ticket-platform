-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

-- Create policies for User
CREATE POLICY "Users can view their own profile" 
ON "User" FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON "User" FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for Event
CREATE POLICY "Events are viewable by everyone" 
ON "Event" FOR SELECT 
TO PUBLIC 
USING (true);

CREATE POLICY "Users can create events" 
ON "Event" FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = "organizerId");

CREATE POLICY "Organizers can update their own events" 
ON "Event" FOR UPDATE 
USING (auth.uid() = "organizerId");

-- Create policies for Ticket
CREATE POLICY "Available tickets are viewable by everyone" 
ON "Ticket" FOR SELECT 
TO PUBLIC 
USING (status = 'AVAILABLE');

CREATE POLICY "Sellers can view all their tickets" 
ON "Ticket" FOR SELECT 
USING (auth.uid() = "sellerId");

CREATE POLICY "Sellers can create tickets" 
ON "Ticket" FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = "sellerId");

CREATE POLICY "Sellers can update their tickets" 
ON "Ticket" FOR UPDATE 
USING (auth.uid() = "sellerId");

-- Create policies for Transaction
CREATE POLICY "Users can view their own transactions (as buyer or seller)" 
ON "Transaction" FOR SELECT 
USING (auth.uid() = "buyerId" OR auth.uid() = "sellerId");

CREATE POLICY "Authenticated users can create transactions" 
ON "Transaction" FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = "buyerId");

-- Note: Transaction updates usually happen via Service Role (Webhooks), 
-- but users might need to update status in some flows? 
-- For now, restrict updates to Service Role or specific conditions if needed.

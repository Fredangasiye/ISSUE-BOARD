import { AIRTABLE_CONFIG } from '@/lib/config';

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: {
    Unit?: number;
    Category?: string;
    Description?: string;
    Status?: string;
    Notes?: string;
    "Date Reported"?: string;
  };
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalIssues: number;
  newIssues: number;
  resolvedIssues: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  recentIssues: Array<{
    unit: number | string;
    category: string;
    description: string;
    status: string;
    dateReported: string;
  }>;
}

export async function generateWeeklyReport(): Promise<WeeklyReport> {
  try {
    // Calculate date range for the past week
    const now = new Date();
    const weekEnd = new Date(now);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    // Fetch all issues from Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLE_NAME}?view=Grid%20view`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const allIssues: AirtableRecord[] = data.records || [];

    // Filter issues from the past week
    const weeklyIssues = allIssues.filter(issue => {
      const issueDate = new Date(issue.fields["Date Reported"] || issue.createdTime);
      return issueDate >= weekStart && issueDate <= weekEnd;
    });

    // Calculate statistics
    const totalIssues = allIssues.length;
    const newIssues = weeklyIssues.length;
    const resolvedIssues = weeklyIssues.filter(issue => 
      issue.fields.Status?.toLowerCase() === 'resolved'
    ).length;

    const byCategory = calculateByCategory(weeklyIssues);
    const byStatus = calculateByStatus(weeklyIssues);

    // Get recent issues (last 5)
    const recentIssues = allIssues
      .sort((a, b) => new Date(b.fields["Date Reported"] || b.createdTime).getTime() - 
                     new Date(a.fields["Date Reported"] || a.createdTime).getTime())
      .slice(0, 5)
      .map(issue => ({
        unit: issue.fields.Unit || 'N/A',
        category: issue.fields.Category || 'Uncategorized',
        description: issue.fields.Description || 'No description',
        status: issue.fields.Status || 'Pending',
        dateReported: issue.fields["Date Reported"] || issue.createdTime
      }));

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalIssues,
      newIssues,
      resolvedIssues,
      byCategory,
      byStatus,
      recentIssues
    };
  } catch (error) {
    console.error('Error generating weekly report:', error);
    throw error;
  }
}

function calculateByCategory(issues: AirtableRecord[]): Record<string, number> {
  const categories: Record<string, number> = {};
  
  issues.forEach(issue => {
    const category = issue.fields.Category || 'Uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return categories;
}

function calculateByStatus(issues: AirtableRecord[]): Record<string, number> {
  const statuses: Record<string, number> = {};
  
  issues.forEach(issue => {
    const status = issue.fields.Status || 'Pending';
    statuses[status] = (statuses[status] || 0) + 1;
  });
  
  return statuses;
}

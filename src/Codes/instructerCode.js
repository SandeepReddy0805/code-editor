export const imports = 
`
import java.util.*;
import java.io.*;
`;
export const driverCode = 
`
class Main {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(System.in);
        int T = Integer.parseInt(scanner.nextLine().trim());
        long timeLimit = 1000; // time limit in milliseconds
        String lastExecutedInput = "";
        
        Solver solver = new Solver(T,scanner);
        Thread thread = new Thread(solver);
        thread.start();
        long startTime = System.currentTimeMillis();
        while(thread.isAlive()){
            long currTime = System.currentTimeMillis();
            if(currTime - startTime > timeLimit){
                thread.interrupt();
                throw new RuntimeException("TLE on testcase# :" + solver.lastInput);
            }
        }
    }
}

class Solver implements Runnable {
    private final int tests;
    private boolean completed;
    public boolean ans;
    public int lastInput;
    public Scanner scanner;

    public Solver(int tests,Scanner sc) {
        this.tests = tests;
        this.completed = false;
        this.scanner = sc;
    }
    public boolean isCompleted() {
        return completed;
    }
    @Override
    public void run() {
        for (int i = 0; i < tests; i++) {
            int input = scanner.nextInt();
            this.lastInput = input;
            BeingZero bz = new BeingZero();
            try{
                this.ans = bz.solve(input);
            }
            catch(RuntimeException e){
                throw new RuntimeException("Runtime Error at input: " + this.lastInput);
            }
            System.out.println(ans);
        }
        this.completed = true;
    }
}
`